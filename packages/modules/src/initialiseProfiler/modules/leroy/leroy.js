/* eslint-disable */

export const showTableView = () => {
  $('#workload_tabular').removeClass('d-print-none');
  $('#workload_tabular').removeClass('d-none');
  $('#workload_tabular').show();
  $('.viewWorkloadSession__noAthleteMessage').show();
};

export const showGraphView = () => {
  $('#new-graphs').removeClass('d-print-none');
  $('.layout_last_edited, #new-graphs, .add-graph-button').show();
};

export const hideTableView = () => {
  $('#workload_tabular').addClass('d-print-none');
  $('#workload_tabular').addClass('d-none');
  $('#workload_tabular').hide();
  $('.viewWorkloadSession__noAthleteMessage').hide();
};

export const hideGraphView = () => {
  $('#new-graphs').addClass('d-print-none');
  $('.layout_last_edited, #new-graphs, .add-graph-button').hide();
};

export default () => {
  /* Leroy dropdown listeners */
  $(function () {
    // Check whether to show "threshold-type" or "threshold-value" when the edit bar is shown
    if ($('select[name=average-type]').length) {
      $(document).on('click', '.toggle-edit-bar', function () {
        var thisRow = $(this).closest('.row'),
          averageTypeValue = $(thisRow)
            .find('select[name=average-type]')
            .find('option[selected]')
            .val(),
          thresholdTypeValue = $(thisRow)
            .find('select[name=threshold-type]')
            .find('option[selected]')
            .val();
        if (averageTypeValue)
          $(thisRow)
            .find('select[name=threshold-type]')
            .parent()
            .removeClass('d-none');
        if (thresholdTypeValue)
          $(thisRow).find('.threshold-value').parent().removeClass('d-none');
      });
    }
    $(document).on('click', '.edit-bar-apply', function () {
      closeAnyOpenSelects();
    });
    $(document).on('change', 'select[name=average-type]', function (event) {
      var thisRow = $(this).closest('.row'),
        thisValue = $(this).find('option[selected]').val();
      if (thisValue !== '') {
        // Show the threshold selector
        $(thisRow)
          .find('select[name=threshold-type]')
          .parent()
          .removeClass('d-none');
      } else {
        // Hide the threshold selector and modifier and reset its value
        $(thisRow)
          .find('select[name=threshold-type]')
          .parent()
          .addClass('d-none');
        $(thisRow).find('.threshold-value').parent().addClass('d-none');
        resetSelect($(thisRow).find('select[name=threshold-type]'));
      }
    });
    $(document).on(
      'change',
      'input[name=threshold-value-input]',
      validateThresholdValue
    );
    $(document).on(
      'keyup',
      'input[name=threshold-value-input]',
      validateThresholdValue
    );
    function validateThresholdValue(event) {
      var _this = $(event.target)
          .closest('.row')
          .find('input[name=threshold-value-input]'),
        thresholdType = $(_this)
          .closest('.row')
          .find('select[name=threshold-type]')
          .find('option[selected]')
          .val(),
        amount = $(_this).val();
      // Check it's a number
      if (!amount) return;
      if (!isNumeric(amount)) {
        var newAmount = 0;
        if (thresholdType === 'percentage') {
          newAmount = '10';
        } else if (thresholdType === 'deviation') {
          newAmount = '2';
        }
        $(_this).val(newAmount);
        flashThresholdInputBox(_this);
      } else {
        // It's a number - check if within range
        if (thresholdType === 'percentage' && amount > 110) {
          $(_this).val(110);
          flashThresholdInputBox(_this);
        } else if (thresholdType === 'deviation' && amount > 3) {
          $(_this).val(3);
          flashThresholdInputBox(_this);
        } else if (amount < 0) {
          $(_this).val(0);
          flashThresholdInputBox(_this);
        }
      }
    }
    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function flashThresholdInputBox(target) {
      $(target).addClass('highlight');
      setTimeout(function () {
        $(target).removeClass('highlight');
      }, 200);
    }
    function resetSelect(select) {
      $(select).find('option[selected=selected]').attr('selected', false);
      $(select)
        .parent()
        .find('.kitman-select-items li.selected')
        .removeClass('selected');
      var firstSelectItem = $(select)
        .parent()
        .find('.kitman-select-items li:first-child');
      firstSelectItem.addClass('selected');
      $(select).parent().find('.selected-text').text($(firstSelectItem).text());
    }
    $(document).on('change', 'select[name=threshold-type]', function (event) {
      var thisRow = $(this).closest('.row'),
        thisValue = $(this).find('option[selected]').val();
      if (thisValue !== '') {
        // Show the threshold modifier
        // Set focus on the modifier
        $(thisRow).find('.threshold-value').parent().removeClass('d-none');
        // Set the focus
        $(thisRow).find('input[name=threshold-value-input]').select();
        // Set the symbol and value
        $(thisRow)
          .find('input[name=threshold-value-input]')
          .attr('value', getDefaultValue(thisValue));
        // Set the max value
        $(thisRow)
          .find('input[name=threshold-value-input]')
          .attr('max', getMaxValue(thisValue));
        $(thisRow).find('.add-on').text(getSymbolFor(thisValue, thisRow));
      } else {
        // Hide the modifier (keep the value?)
        $(thisRow).find('.threshold-value').parent().addClass('d-none');
      }
      validateThresholdValue(event);
    });
    function getSymbolFor(thisValue) {
      if (thisValue === 'percentage') {
        return '%';
      } else if (thisValue === 'deviation') {
        return 'σ';
      } else {
        return '';
      }
    }
    function getDefaultValue(thisValue) {
      if (thisValue === 'percentage') {
        return '10';
      } else if (thisValue === 'deviation') {
        return '2';
      } else {
        return 0;
      }
    }
    function getMaxValue(thisValue) {
      if (thisValue === 'percentage') {
        return '110';
      } else if (thisValue === 'deviation') {
        return '4';
      } else {
        return 0;
      }
    }
  });

  /* GENERAL PURPOSE STUFF */

  $(function () {
    // Show / hide edit bar
    $('body').on('click', '.toggle-edit-bar', function () {
      window.toggleEditBar($(this).closest('.graph-container'));
      closeAnyOpenSelects();
    });
    $('body').on('click', '.graph-group-holder', function (e) {
      var graph = $(this).closest('.leroy-graph');
      if ($(graph).hasClass('edit')) {
        window.toggleEditBar($(this).closest('.graph-container'));
      }
    });
    $('body').on('click', '.edit-bar-remove', removeGraph);
    $('body').on('click', '.edit-bar-cancel', resetEditBar);
    $('body').on('click', '.edit-bar-apply', updateGraph);
  });

  window.toggleEditBar = function (container) {
    container.find('.edit-cog-image').toggleClass('edit');
    container.find('.edit-bar').toggleClass('show');
    container.find('.leroy-graph').toggleClass('edit');
    container.find('.title-text').toggleClass('show');
    container.find('.js-graph-title').toggleClass('show');
    container.find('.legend-biomechanical').toggleClass('show');
  };

  function resetEditBar() {
    // Reset the selectors
    closeAnyOpenSelects();
    window.toggleEditBar($(this).closest('.graph-container'));

    // if empty - remove the last container from the DOM
    if (
      $('.leroy-chart-container')
        .last()
        .find('.graph-group-holder')
        .is(':empty')
    ) {
      $('.leroy-chart-container').last().remove();
      $('.add-graph-button').attr('disabled', false);
    }
  }

  function closeAnyOpenSelects() {
    // Close any open selects
    $('.kitman-select-ui').find('.toggle-list').removeClass('active');
    $('.kitman-select-ui').find('.kitman-select-items').removeClass('show');
  }

  function updateGraph(e) {
    // This behaviour might be specific to the leroy graphs
    // Loudnoises and other graphs will need to do something, like an ajax call
    // Currently, this event is also picked up by graphing js
    window.toggleEditBar($(this).closest('.graph-container'));
    $('.add-graph-button').attr('disabled', false);
    setPageLayout();
  }

  function removeGraph(e) {
    $('.add-graph-button').attr('disabled', false);
    var container = $(this).closest('.graph-container');
    $(container).addClass('remove');
    // Slide up all graphs beneath this one
    var graphFound = false;
    var graphHeight = $(container).height() + 56;
    $.each($('.graph-container'), function (index, graph) {
      if (graphFound) {
        transformGraphUpwards(graph, graphHeight, index);
      }
      if ($(graph).hasClass('remove')) {
        graphFound = true;
      }
    });

    setTimeout(function () {
      $(container).remove();
      if (typeof graphView !== 'undefined') {
        graphView.css('height', 'auto');
      }
    }, 600);

    setTimeout(function () {
      setPageLayout();
    }, 700);
  }

  window.standardDeviation = function (values) {
    var avg = window.average(values);

    var squareDiffs = values.map(function (value) {
      var diff = value - avg;
      var sqrDiff = diff * diff;
      return sqrDiff;
    });

    var avgSquareDiff = window.average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
  };

  window.average = function (data) {
    var sum = data.reduce(function (sum, value) {
      return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
  };

  function transformGraphUpwards(graph, height, index) {
    var point1Height = 1 - (0.2 + index / 10);
    if (point1Height > 1) point1Height = 1;
    var point1X = 0.2 + index / 10;
    if (point1X > 1) point1X = 1;
    var transition =
      'all .6s cubic-bezier(' + point1X + ',' + point1Height + ',.1,1)';
    $(graph).css({
      transform: 'translateY(-' + height + 'px)',
      transition: transition,
    });
    setTimeout(function () {
      $(graph).css({
        transform: 'none',
        transition: 'none',
      });
    }, 600);
  }

  var setPageLayout = function () {
    var active_variables = [];
    $('body')
      .find('input[name^="leroy_variable"]')
      .each(function (index, input) {
        var graph = $(input).closest('.leroy-graph');
        active_variables.push({
          name: $(input).val(),
          average: $(graph).find('select[name="average-type"]').val(),
          threshold: {
            type: $(graph)
              .find('select[name=threshold-type]')
              .find('option[selected]')
              .val(),
            value: $(graph).find('input[name=threshold-value-input]').val(),
          },
        });
      });

    //append extra variables to the json structure
    if (window.extra_variables) {
      window.extra_variables.forEach(function (item) {
        active_variables.push({
          name: item.name,
          average: item.average,
          threshold: {
            type: item.threshold.type,
            value: item.threshold.value,
          },
        });
      });
    }

    $.ajax({
      url: '/layouts/set',
      method: 'POST',
      data: { structure: active_variables, page_key: 'SESSION_SHOW', id: null },
      error: function (error) {
        if (console && console.error) {
          console.error(error);
        }
      },
      success: function (data) {
        return;
      },
    });
  };

  window.updateLayout = function (layout_id) {
    $.ajax({
      url: '/layouts/set_layout_id',
      method: 'POST',
      data: { id: layout_id },
      error: function (error) {
        console.info(error);
      },
      success: function (data) {
        location.reload();
      },
    });
    return false;
  };
};
