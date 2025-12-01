export default () => {
  const initChartsOnScroll = ($, window) => {
    /*
      Call-back when a user has stoppped-scrolling
      A light-weight solution for rendering graphs on scroll
    */
    // eslint-disable-next-line func-names, no-param-reassign
    $.fn.scrollStopped = function (callback) {
      // eslint-disable-next-line func-names
      $(this).on('scroll', function () {
        const self = this;
        const $this = $(self);
        if ($this.data('scrollTimeout')) {
          clearTimeout($this.data('scrollTimeout'));
        }
        $this.data('scrollTimeout', setTimeout(callback, 50, self));
      });
    };

    /**
     * shouldInitialiseGraph
     * element (Object) - target graph DOM element
     *
     * Decides whether we should initialise a graph based on
     * it's location relative to the viewport
     */
    const shouldInitialiseGraph = (element) => {
      const topOfElement = $(element).offset().top;
      const bottomOfScreen = $(window).scrollTop() + $(window).height();

      return bottomOfScreen > topOfElement;
    };

    /**
     * isGraphInitialised
     * element (Object) - target graph DOM element
     *
     * Checks to see if the graph has been already initialised
     */
    const isGraphInitialised = (element) => $(element).find('svg').length > 0;

    /**
     * initialiseGraph
     * element (Object) - target graph DOM element
     *
     * Initialise the graph
     */
    const initialiseGraph = (element) => {
      // run render function (functions are bound to the global window object)
      if (typeof window[`render_${$(element).attr('id')}`] === 'function') {
        // add class to flag its been initialised
        window[`render_${$(element).attr('id')}`]();
      }
    };

    /**
     * initGraphs
     *
     * Checks if graphs should be initialised and initalises them
     */

    const initGraphs = () => {
      // get all the graphs on the page
      const graphs = $('div.graph');

      // check and initialise graphs
      graphs.each((index, graph) => {
        if (shouldInitialiseGraph(graph)) {
          if (!isGraphInitialised(graph)) {
            initialiseGraph(graph);
          }
        }
      });
    };

    /**
     * init
     *
     * Initialise function
     */
    const init = () => {
      // event listener for stop scrolling
      $(window).scrollStopped(() => {
        initGraphs();
      });

      // run scroll function on page load
      $(window).trigger('scroll');
    };

    $(document).ready(() => {
      init();
    });
  };

  initChartsOnScroll($, window);
};
