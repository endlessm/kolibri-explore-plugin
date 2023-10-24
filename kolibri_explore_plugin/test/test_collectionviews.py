import json

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from .utils import COLLECTIONSDIR
from kolibri_explore_plugin import collectionviews


@pytest.mark.django_db
def test_get_collection_info():
    url = reverse("kolibri:kolibri_explore_plugin:get_collection_info")
    client = APIClient()

    # Unspecified or missing grade/name results in null info.
    for grade, name in (
        (None, None),
        ("foo", None),
        (None, "foo"),
        ("foo", "bar"),
    ):
        params = {}
        if grade:
            params["grade"] = grade
        if name:
            params["name"] = name
        resp = client.get(url, params)
        assert resp.status_code == 200
        assert resp.json() == {"collectionInfo": None}

    # Test each supported collection.
    for grade in collectionviews.COLLECTION_GRADES:
        for name in collectionviews.COLLECTION_NAMES:
            collection_path = COLLECTIONSDIR / f"{grade}-{name}.json"
            with collection_path.open("r") as f:
                collection_data = json.load(f)
            expected_data = {
                "collectionInfo": {
                    "grade": grade,
                    "name": name,
                    "metadata": collection_data["metadata"],
                    "available": True,
                    "channelsCount": len(collection_data["channels"]),
                }
            }

            resp = client.get(url, {"grade": grade, "name": name})
            assert resp.status_code == 200
            assert resp.json() == expected_data


@pytest.mark.django_db
def test_get_all_collections_info():
    url = reverse("kolibri:kolibri_explore_plugin:get_all_collections_info")
    client = APIClient()

    all_collections_info = []
    for grade in collectionviews.COLLECTION_GRADES:
        grade_info = {"grade": grade, "collections": []}
        all_collections_info.append(grade_info)
        for name in collectionviews.COLLECTION_NAMES:
            collection_path = COLLECTIONSDIR / f"{grade}-{name}.json"
            with collection_path.open("r") as f:
                collection_data = json.load(f)
            grade_info["collections"].append(
                {
                    "grade": grade,
                    "name": name,
                    "metadata": collection_data["metadata"],
                    "available": True,
                    "channelsCount": len(collection_data["channels"]),
                }
            )
    expected_data = {"allCollectionsInfo": all_collections_info}

    resp = client.get(url)
    assert resp.status_code == 200
    assert resp.json() == expected_data


@pytest.mark.django_db
def test_get_should_resume():
    url = reverse("kolibri:kolibri_explore_plugin:get_should_resume")
    client = APIClient()
    session = client.session

    # With no existing state.
    current_state = None
    state = session.get("COLLECTIONS_STATE")
    assert state == current_state
    resp = client.get(url)
    assert resp.json() == {"shouldResume": False, "grade": None, "name": None}

    # Intermediate state.
    current_state = {
        "grade": "artist",
        "name": "0001",
        "stage": collectionviews.DownloadStage.IMPORTING_CONTENT.name,
    }
    session["COLLECTIONS_STATE"] = current_state
    session.save()
    state = session.get("COLLECTIONS_STATE")
    assert state == current_state
    resp = client.get(url)
    assert resp.json() == {
        "shouldResume": True,
        "grade": "artist",
        "name": "0001",
    }

    # Completed state.
    current_state = {
        "grade": "artist",
        "name": "0001",
        "stage": collectionviews.DownloadStage.COMPLETED.name,
    }
    session["COLLECTIONS_STATE"] = current_state
    session.save()
    state = session.get("COLLECTIONS_STATE")
    assert state == current_state
    resp = client.get(url)
    assert resp.json() == {
        "shouldResume": False,
        "grade": "artist",
        "name": "0001",
    }
