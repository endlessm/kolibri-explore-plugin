# Test channel DB data

Each JSON file represents a Kolibri channel in a format that can be used
to create an sqlite channel database using sqlalchemy. In addition, each
`content_localfile` entry has a `_content` field that represents the
actual file content base64 encoded. This allows the test channel JSON
file to represent a channel and all of its contents. The `_content`
field does not correspond to an actual database field and must be
removed before processing with sqlalchemy.

Each channel has the same node structure:

* Root topic with no files
  * Video with high res, low res, subtitles and thumbnail files
  * Sub topic with thumbnail file
    * HTML5 app with zip and thumbnail files
    * Document with epub and thumbnail files
    * Audio with only mp3 file

In all there are 6 nodes and 10 files per channel. 4 of the files are
thumbnails.
