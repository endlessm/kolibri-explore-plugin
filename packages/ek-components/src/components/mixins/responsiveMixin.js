export default {
  data() {
    return {
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      xsQueryList: null,
      smQueryList: null,
      mdQueryList: null,
      lgQueryList: null,
      xlQueryList: null,
      breakpointValues: null,
    };
  },
  created() {
    const { sm, md, lg, xl } = this.getBreakpoints();

    this.xsQueryList = window.matchMedia(`(max-width: ${sm})`);
    this.smQueryList = window.matchMedia(`(min-width: ${sm}) and (max-width: ${md})`);
    this.mdQueryList = window.matchMedia(`(min-width: ${md}) and (max-width: ${lg})`);
    this.lgQueryList = window.matchMedia(`(min-width: ${lg}) and (max-width: ${xl})`);
    this.xlQueryList = window.matchMedia(`(min-width: ${xl})`);

    this.xsQueryList.addListener(this.onXsChange);
    this.smQueryList.addListener(this.onSmChange);
    this.mdQueryList.addListener(this.onMdChange);
    this.lgQueryList.addListener(this.onLgChange);
    this.xlQueryList.addListener(this.onXlChange);

    // First launch
    this.onXsChange(this.xsQueryList);
    this.onSmChange(this.smQueryList);
    this.onMdChange(this.mdQueryList);
    this.onLgChange(this.lgQueryList);
    this.onXlChange(this.xlQueryList);
  },
  destroyed() {
    this.xsQueryList.removeListener(this.onXsChange);
    this.smQueryList.removeListener(this.onSmChange);
    this.mdQueryList.removeListener(this.onMdChange);
    this.lgQueryList.removeListener(this.onLgChange);
    this.xlQueryList.removeListener(this.onXlChange);
  },
  methods: {
    onXsChange(ev) {
      this.xs = ev.matches;
    },
    onSmChange(ev) {
      this.sm = ev.matches;
    },
    onMdChange(ev) {
      this.md = ev.matches;
    },
    onLgChange(ev) {
      this.lg = ev.matches;
    },
    onXlChange(ev) {
      this.xl = ev.matches;
    },
    getBreakpoints() {
      if (!this.breakpointValues) {
        // Get breakpoints defined by bootstrap styles. Ideally we should be
        // able to just import the variables like:
        // import { sm, md, lg, xl } from '../../styles.scss';
        // But unfortunately kolibri-tools is not capable of doing such import.
        // This code is based on:
        // https://github.com/shaack/bootstrap-detect-breakpoint/blob/master/src/bootstrap-detect-breakpoint.js
        const breakpointNames = ['xl', 'lg', 'md', 'sm', 'xs'];
        this.breakpointValues = {};
        for (const breakpointName of breakpointNames) {
          this.breakpointValues[breakpointName] = window
            .getComputedStyle(document.documentElement)
            .getPropertyValue('--breakpoint-' + breakpointName);
        }
      }

      return this.breakpointValues;
    },
  },
};
