# Technical information for the Template System

To use the template system you need to create a new directory inside
`template-ui/channel-overrides/` with an empty `styles.scss`.

The override is no more than a symlink pointing to your directory from
`template-ui/src/overrides`. You can use the commands
`scripts/set_override.py` and `scripts/clear_override.py` to do it
safely. Check the `--help` of each command for details.

## Overriding

### CSS

Custom CSS goes to your `styles.scss`. In particular, Bootstrap
variables can be set, like: `$primary: #42b983;`. See the
`default/styles.scss` for reference.

### Image assets

Image assets can be added to your override in a `assets/`
subdirectory. See the `assetFilenames` Vuex store object for the
mapping of asset name -> default file name.

These file names also enforce a file format (because of the way
Webpack loaders work) but the good news is that you can override the
mapping and change any file name. See **Custom store state** below.

### Custom store state

You can override the initial Vuex store state if you add an
`options.json` file in your directory override. Here is an example for
customizing the asset filenames:

```
{
  "assetFilenames": {
    "defaultThumbnail": "custom.png",
    "homeBackgroundImage": "custom.png",
    "sectionBackgroundImage": "custom.png",
    "footerImage": "custom.png"
  }
}
```

### Components

Vue components can be added to your override in a `components/`
subdirectory. They will replace any component in `src/components/` if
they have the same file name. You can start by copying one component
and doing slight modifications.

## Example override directory structure

```
.
 \_ styles.scss
 \_ options.json
 \_ assets/
           \_ footer-background.jpg
           \_ custom-asset.svg
 |
 \_ components/
               \_ HeaderNavBarBrand.vue
               \_ SectionTitle.vue
```
