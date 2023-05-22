import Vue from 'vue';

function dynamicLoadComponents(requireContext) {
  requireContext.keys().forEach((fileName) => {
    // Remove './' prefix and '.vue' suffix from file name:
    const componentName = fileName.slice(2, -4);
    if (componentName in Vue.options.components) {
      return;
    }
    const component = requireContext(fileName).default;
    Vue.component(componentName, component);
  });
};

export default function () {
  try {
    dynamicLoadComponents(require.context(
      '@/overrides/components', false, /.vue$/,
    ));
  } catch (e) {
    // There aren't component overrides. Nothing to do.
  }

  try {
    dynamicLoadComponents(require.context(
      './components', false, /.vue$/,
    ));
  } catch (e) {
    // This component doesn't exists in the template
  }

  dynamicLoadComponents(require.context(
    'ek-components/src/components', false, /.vue$/,
  ));
}
