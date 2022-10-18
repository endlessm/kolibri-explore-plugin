from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def get_collections_info(request):
    """Return the collections and their availability."""
    # FIXME implement
    return Response({"collectionsInfo": {}})


@api_view(["GET"])
def get_should_resume(request):
    """Return if there is a saved state that should be resumed."""
    # FIXME implement
    return Response({"shouldResume": True})


@api_view(["POST"])
def start_download(request):
    """Start downloading a collection.

    Pass the collection "grade" and "name" in the POST data.

    Returns download status.
    """
    # FIXME implement
    return Response({"status": {}})


@api_view(["POST"])
def resume_download(request):
    """Resume download from a previous session.

    Returns download status.
    """
    # FIXME implement
    return Response({"status": {}})


@api_view(["POST"])
def update_download(request):
    """Continue downloading current collection.

    Save state when the dowload status changes.

    Returns download status.
    """
    # FIXME implement
    return Response({"status": {}})


@api_view(["DELETE"])
def cancel_download(request):
    """Cancel current download and clear the saved state.

    Returns download status.
    """
    # FIXME implement
    return Response({"status": {}})


@api_view(["GET"])
def get_download_status(request):
    """Return the download status."""
    # FIXME implement
    return Response({"status": {}})
