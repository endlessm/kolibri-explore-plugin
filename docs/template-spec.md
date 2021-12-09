# Specification for the Template System

Creating a more engaging presentation for a Kolibri channel involves
providing image assets and metadata. This is on top of all the channel
assets and metadata already provided in Kolibri Studio like: Channel
name, description, thumbnail. And all the content name, description,
thumbnail. The template will use all this information.

### Branding colors

The minimum information you have to provide is your trademark branding
colors:

- Primary color -- Format: any CSS color format.
- Secondary color -- Format: any CSS color format.

Just with that you will have a template that is at least
customized. The rest is all optional.

In addition to primary and secondary colors, semantic color variants
can be specified for meaning like: success color, danger color,
warning color, info color. Although the template doesn't use all of
them at the moment. Please refer to the [Bootstrap documentation on
colors](https://getbootstrap.com/docs/4.1/utilities/colors/#color) for
a full list.

### Adding image assets

The next level of customization is adding background images:

- Home background image -- Format: PNG/JPEG/SVG image.
- Section background image -- Format: PNG/JPEG/SVG image.
- Header background image -- Format: PNG/JPEG/SVG image.
- Footer background image -- Format: PNG/JPEG/SVG image.
- Default card image -- Format: PNG/JPEG/SVG image.

The default card image is the thumbnail that will be used when the
content doesn't have any thumbnail attached to it in Kolibri Studio.

**Note:** There is a default file name and format for each image
asset. Please refer to the [template technical
information](./template-tech-info.md) for details on how to change
these defaults.

### Overriding components

The template is modularized into components like header, footer, card
grid. And a capable web developer can customize full parts of the
template by providing replacements for them. Please refer to the
[template technical information](./template-tech-info.md) for how to
do it.

This is a more powerful customization than just defining colors and
image assets, while still using the template system. If this still
doesn't suit your needs, you can create a fully custom presentation
for your channel using the [Kolibri API](../kolibri-api) that will be
succeeded by the [API Specification for kolibri
object](https://www.notion.so/API-Specification-for-kolibri-object-6553f24706b34f13b28a0f1dffc70f8a).

### More metadata coming soon

Soon you will be able to pass more options to the template to change
the navigation in different ways like: pagination, collapsible cards,
number of columns in the card grid.

For app-ifying the channel on Endless OS, the channel thumbnail will
be used to create the desktop icon.

## Exclusive to the Kolibri Explore mid-term solution

For the mid-term Kolibri Explore (plugin) solution, we also have an
asset for the card in the frontpage. And a background color or
background tiled image for the content page.

- Card background image -- Format: PNG/JPEG/SVG.
- Content background color -- Format: any CSS color format.
- Content background image -- Format: PNG/JPEG/SVG.

## List of all current assets and metadata

- Primary branding color -- Format: any CSS color format.
- Secondary branding color -- Format: any CSS color format.
- Additional color variants
- Home background image -- Format: PNG/JPEG/SVG image.
- Section background image -- Format: PNG/JPEG/SVG image.
- Header background image -- Format: PNG/JPEG/SVG image.
- Footer background image -- Format: PNG/JPEG/SVG image.
- Default card image -- Format: PNG/JPEG/SVG image.
- Card background image -- Format: PNG/JPEG/SVG.
- Content background color -- Format: any CSS color format.
- Content background image -- Format: PNG/JPEG/SVG.
