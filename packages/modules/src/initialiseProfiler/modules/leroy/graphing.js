/* eslint-disable */
import Handlebars from 'handlebars';

export default () => {
  /* LEROY GRAPH FUNCTIONS */
  const initLeroyGraphs = (chartData) => {
    // Anonymous function containing the model, views and controller logic
    var model = {
      graphData: {
        oneLegend: true,
      },
      templates: {},
      init: function () {
        window.extra_variables = []; // storing the variables for which we can't graph
        setData(chartData);
      },
    };

    var setData = function (data) {
      data = $.extend(data, {
        squadAverages: controller.calculateSquadAverage(data),
        squadStandardDeviations:
          controller.calculateSquadStandardDeviations(data),
        positionAverages: controller.calculatePositionAverage(data),
        positionStandardDeviations:
          controller.calculatePositionStandardDeviations(data),
      });

      model.graphData = $.extend(model.graphData, data);

      controller.setUpEventListeners();
      controller.generateAxisHighValues();
      controller.generatePositions();
      // Only show presets if we have players also
      if (data.presets.length && data.playerDataArray.length) {
        controller.generatePresetGraphs(data.presets);
      }
    };

    var graphView = {
      render: function (
        thisGraph,
        titleHTML,
        graph_group_html,
        legendItemsHTML
      ) {
        var container = $(thisGraph);
        container.find('.title-text').html(titleHTML);
        container.find('.graph-group-holder').html(graph_group_html);
        container.find('.slideinLegend-content').html(legendItemsHTML);
      },
    };

    var controller = {
      init: function () {
        controller.generateTemplates();
        model.init();
      },
      generateTemplates: function () {
        var templates = {};
        templates.graph_empty_template = Handlebars.compile(
          $('#graph-empty').html()
        );
        templates.graph_group_template = Handlebars.compile(
          $('#graph-group').html()
        );
        templates.graph_axis_template = Handlebars.compile(
          $('#graph-axis').html()
        );
        templates.graph_item_template = Handlebars.compile(
          $('#graph-item').html()
        );
        templates.legend_item = Handlebars.compile($('#legend-item').html());
        templates.chart_container_template = Handlebars.compile(
          $('#chart-container').html()
        );
        model.templates = templates;
      },
      generateAxisHighValues: function () {
        var highValues = {};
        Object.keys(model.graphData.variablesArray).forEach(function (
          variable,
          index
        ) {
          highValues[variable] = controller.getHighestValue(variable);
        });
        model.graphData.highValues = highValues;
      },
      getHighestValue: function (variable) {
        var highest = 0;
        model.graphData.playerDataArray.forEach(function (playerData) {
          for (var playerDataVariable in playerData) {
            if (playerDataVariable == variable) {
              var thisNumber = playerData[playerDataVariable];
              if (thisNumber > highest) {
                highest = playerData[playerDataVariable];
              }
            }
          }
        });
        return highest;
      },
      generatePositions: function () {
        var positions = {};
        var classNumber = 1;
        var positionsMap = model.graphData.positionsMap;
        model.graphData.playerDataArray.forEach(function (playerData) {
          var pos = playerData['athlete_position'];
          if (!(pos in positions)) {
            // Get the readible label from the map
            if (pos in positionsMap) {
              var label = positionsMap[pos];
            } else {
              var label = pos;
            }

            // Add in the key
            // Where the position is 'Other' assign a class of 'position-other'
            positions[playerData['athlete_position']] = {
              label: label,
              class:
                pos != 'Other' ? 'position-' + classNumber : 'position-other',
            };

            if (pos != 'Other') classNumber++;
          }
        });
        model.graphData.positions = positions;
      },
      setUpEventListeners: function () {
        $('body').on('click', '.edit-bar-apply', function () {
          controller.generateGraphs($(this).closest('.graph-container'));
        });
        if ($('.add-graph-button').length) {
          $('.add-graph-button').on('click', function () {
            $(this).attr('disabled', true);
            var isEmpty = true;
            controller.addNewGraphContainer(isEmpty);
            controller.buildSelects();
            window.toggleEditBar($('body').find('.graph-container').last());
          });
        }
      },
      addFirstSelectionListener: function (newGraphContainer) {
        // Listen (once) for the first selection to enable the Apply button
        newGraphContainer
          .find('select[name=variables]:last')
          .one('change', function (e) {
            controller.enableApplyButton(newGraphContainer);
          });
      },
      generatePresetGraphs: function (presetArray) {
        // For each preset in the presetArray
        presetArray.forEach(function (preset) {
          // Instantiate an empty graph holder
          controller.addNewGraphContainer();
          var newGraphContainer = $('#new-graphs')
              .find('.leroy-chart-container')
              .last(),
            newGraphContainer = $(newGraphContainer);
          // Based on values in the presetArray, update the selected state of the athletes and variables in the container
          if (preset.athletes[0] === 'all') {
            // Set all athletes to selected
            newGraphContainer
              .find('select[name=athlete] option')
              .each(function (index, option) {
                $(option).attr('selected', true);
              });
          } else {
            // TODO
          }
          preset.variables.forEach(function (variable) {
            newGraphContainer
              .find('select[name=variables] option')
              .each(function (index, option) {
                if ($(option).data('variable') == variable.name) {
                  $(option).attr('selected', true);
                }
              });
          });

          controller.enableApplyButton(newGraphContainer);

          // Run the generateGraphs function on this container
          controller.generateGraphs(newGraphContainer, preset.variables[0]);
        });
        // Update the kitman-selects - TODO - make this more standalone
        controller.buildSelects();
      },
      buildSelects: function () {
        if (window.kitmanSelect !== undefined) {
          window.kitmanSelect().init();
        }
      },
      addNewGraphContainer: function (isEmpty) {
        var playerDataArray = model.graphData.playerDataArray;
        var variablesArray = model.graphData.variablesArray;
        var athletesHTML = controller.buildAthleteListHTML(playerDataArray);
        var variablesHTML = controller.buildVariableListHTML(variablesArray);
        var newGraphContainerHTML = model.templates.chart_container_template({
          athletesHTML: athletesHTML,
          variablesHTML: variablesHTML,
        });

        var newGraphContainer = $(newGraphContainerHTML).appendTo(
          '#new-graphs'
        );

        if (isEmpty) controller.addFirstSelectionListener(newGraphContainer);

        // Quick hack, set all athletes to selected (TODO: remove when reenabling athlete selector)
        $('select[name=athlete] option').each(function (index, option) {
          $(option).attr('selected', true);
        });
      },
      buildAthleteListHTML: function (playerDataArray) {
        var playerPositions =
          controller.buildGroupedAthleteList(playerDataArray);
        // Sort the list then create HTML
        var athleteHTML = '';
        for (var position in playerPositions) {
          if (athleteHTML == '') {
            athleteHTML = '<optgroup label="' + position + '">';
            var currentPosition = position;
          } else if (currentPosition !== position) {
            currentPosition = position;
            athleteHTML += '</optgroup><optgroup label="' + position + '">';
          }
          playerPositions[position].sort().forEach(function (player) {
            athleteHTML +=
              '<option data-id="' +
              player['id'] +
              '" data-position="' +
              position +
              '">' +
              player['name'] +
              '</option>';
          });
        }
        athleteHTML += '</optgroup>';
        return athleteHTML;
      },
      buildGroupedAthleteList: function (playerDataArray) {
        // Assumption: I'm assuming positions are specified, as per the demo data
        if (!playerDataArray[0]) return;
        var playerPositions = {};
        playerPositions[playerDataArray[0]['athlete_position']] = [];
        var currentPosition = playerDataArray[0]['athlete_position'];
        playerDataArray.forEach(function (player, index) {
          if (player['athlete_position'] == currentPosition) {
            playerPositions[currentPosition].push({
              name: player['athlete_name'],
              id: player['id'],
            });
          } else {
            currentPosition = player['athlete_position'];
            if (typeof playerPositions[currentPosition] !== 'object') {
              playerPositions[currentPosition] = [];
            }
            playerPositions[currentPosition].push({
              name: player['athlete_name'],
              id: player['id'],
            });
          }
        });
        return playerPositions;
      },
      buildVariableListHTML: function (variablesArray) {
        var variablesHTML = '';
        Object.keys(variablesArray).forEach(function (variable, index) {
          variablesHTML +=
            '<option data-variable="' +
            variable +
            '">' +
            variablesArray[variable].name +
            '</option>';
        });
        return variablesHTML;
      },
      generateGraphs: function (thisGraph, presetVariables) {
        if (presetVariables && presetVariables.average) {
          $(thisGraph)
            .find('select[name="average-type"]')
            .val(presetVariables.average);
          $(thisGraph)
            .find('select[name="average-type"] option[value=""]')
            .removeAttr('selected');
          $(thisGraph)
            .find(
              'select[name="average-type"] option[value="' +
                presetVariables.average +
                '"]'
            )
            .attr('selected', 'selected');
        }

        if (presetVariables && presetVariables.threshold) {
          $(thisGraph)
            .find('select[name=threshold-type]')
            .find('option[selected]')
            .val(presetVariables.threshold.type);
          $(thisGraph)
            .find('select[name=threshold-type]')
            .find('option[selected]')
            .removeAttr('selected');
          $(thisGraph)
            .find(
              'select[name=threshold-type] option[value="' +
                presetVariables.threshold.type +
                '"]'
            )
            .attr('selected', 'selected');

          if (presetVariables.threshold.value) {
            $(thisGraph)
              .find('input[name=threshold-value-input]')
              .val(presetVariables.threshold.value);
          }
        }

        // Check for the existence of threshold settings
        var threshold_settings = {};
        threshold_settings.threshold_type = $(thisGraph)
          .find('select[name="threshold-type"]')
          .find('option[selected]')
          .val();
        threshold_settings.threshold_value = $(thisGraph)
          .find('input[name="threshold-value-input"]')
          .val();

        var athletes_array = [],
          variables_array = [];

        $(thisGraph)
          .find('select[name=athlete]')
          .find('option[selected=selected]')
          .each(function (i, item) {
            var athlete_object = {
              id: $(item).data('id'),
              name: $(item).text(),
              position: $(item).data('position'),
            };
            athletes_array.push(athlete_object);
          });
        $(thisGraph)
          .find('select[name=variables]')
          .find('option[selected=selected]')
          .each(function (i, item) {
            if ($(item).attr('selected')) {
              variables_array.push($(item).text());
            }
          });
        if (variables_array.length == 0) {
          $(thisGraph).attr('style', 'display:none;'); // hide graph for invalid training variable
          window.extra_variables.push(presetVariables);
          return;
        }

        // set average type (if set)
        var average_type = $(thisGraph)
          .find('select[name="average-type"]')
          .find('option[selected=selected]')
          .val();

        // Heavy lifting done here
        var graph_groups = controller.generateGraphGroups(
          athletes_array,
          variables_array,
          average_type,
          threshold_settings
        );
        var graph_group_html = graph_groups.html;
        var positionsArray = graph_groups.positionsArray;

        // Update the title for the graph
        var variable_key = $(thisGraph)
          .find('select[name=variables]')
          .find('option[selected=selected]')
          .attr('data-variable');
        var titleHTML = controller.generateTitle(
          athletes_array,
          variables_array,
          variable_key
        );

        // Update the graph's legend
        var legendItemsHTML = controller.createLegendItems(positionsArray);

        // Put the resulting html into the DOM
        graphView.render(
          thisGraph,
          titleHTML,
          graph_group_html,
          legendItemsHTML
        );
      },
      generateGraphGroups: function (
        athletes_array,
        variables_array,
        average_type,
        threshold_settings
      ) {
        // The "variables_array" contains the variable name(s) - use this to get the key(s)
        var variable_id_array = variables_array.map(function (variableName) {
          for (var prop in model.graphData.variablesArray) {
            if (model.graphData.variablesArray[prop].name === variableName) {
              return prop;
            }
          }
        });
        var single_variable_graph_items = [];
        var graph_group_html = '';

        // Use these variables to decide whether to break the wrapping on the single-variable rows
        var tempPosition = '';
        var break_flow = false;

        // An aray of positions, to be used for showing the right legend
        var positionsArray = [];

        $(athletes_array).each(function (i, athlete) {
          var athlete_id = athlete.id;
          var name = athlete.name;
          var position = athlete.position || false;
          var positionClass = controller.getPositionClass(position);
          if (positionsArray.indexOf(position) == -1) {
            positionsArray.push(position);
          }
          if (tempPosition) {
            if (tempPosition !== position) {
              break_flow = true;
            } else {
              break_flow = false;
            }
          }
          tempPosition = position;

          var multiple_variable_graph_items = [];
          var firstname = name.substr(0, name.indexOf(' ')),
            lastname = name.substr(name.indexOf(' ') + 1);

          if (variable_id_array.length == 1) {
            var variable = variable_id_array[0];
            if (variable === 'workload_rpe') {
              var axisMaxValue = model.graphData.rpeMax;
            } else {
              var axisMaxValue = controller.calculateAxisMaxValue(
                controller.getVariableMax(variable)
              );
            }
            var variableValue = controller.getVariableValue(name, variable);
            var graphBarPercent = controller.calculateGraphPercent(
              variableValue,
              axisMaxValue
            );
            var variableUnit = model.graphData.variablesArray[variable]['unit'];

            // could just use logic here for determining average type...
            if (average_type == 'position') {
              var averagePercent =
                (model.graphData.positionAverages[position][variable] /
                  axisMaxValue) *
                100;
              var averageValue =
                model.graphData.positionAverages[position][variable];
              var standardDeviation =
                model.graphData.positionStandardDeviations[position][variable];
            } else if (average_type == 'squad') {
              var averagePercent =
                (model.graphData.squadAverages[variable] / axisMaxValue) * 100;
              var averageValue = model.graphData.squadAverages[variable];
              var standardDeviation =
                model.graphData.squadStandardDeviations[variable];
            } else if (average_type == 'historic' && graphBarPercent) {
              var averagePercent =
                (model.graphData.variableAverages[athlete_id][variable] /
                  axisMaxValue) *
                100;
              var averageValue =
                model.graphData.variableAverages[athlete_id][variable];
              var standardDeviation =
                model.graphData.variableStandardDeviations[athlete_id][
                  variable
                ];
            } else {
              var averagePercent = 0;
              var averageValue = 0;
            }

            if (
              threshold_settings.threshold_type === 'percentage' &&
              averagePercent
            ) {
              var thresholdsArray = controller.calculateThresholdArrayByPercent(
                threshold_settings.threshold_value,
                averagePercent
              );
            } else if (
              threshold_settings.threshold_type === 'deviation' &&
              averagePercent
            ) {
              var thresholdsArray =
                controller.calculateThresholdArrayByDeviation(
                  threshold_settings.threshold_value,
                  standardDeviation,
                  averageValue,
                  averagePercent
                );
            } else {
              var thresholdsArray = [100, 100];
            }

            var graph_data = {
              visibleValue: variableValue,
              graphBarPercent: graphBarPercent,
              thresholdsArray: thresholdsArray,
              barClass: controller.classifyGraphBarColour(
                graphBarPercent,
                thresholdsArray
              ),
              firstname: firstname,
              lastname: lastname,
              position: positionClass,
              break_flow: break_flow,
              unit: variableUnit,
              averagePercent: averagePercent,
              averageValue: averageValue,
            };

            // Put in the axis markers if it's the first item
            graph_data.markers = controller.getAxisMarkers(variable);
            if (i == 0 || break_flow) {
              graph_data.graph_axis = model.templates.graph_axis_template({
                markers: graph_data.markers,
              });
            }
            // Since just one variable, push it to the single_variable_graph_items
            single_variable_graph_items.push({
              graph_item: model.templates.graph_item_template(graph_data),
            });
          } else if (variables_array.length > 1) {
            // Generate a graph item for each variable
            $(variables_array).each(function (j, variable) {
              if (variable === 'workload_rpe') {
                var axisMax = model.graphData.rpeMax;
              } else {
                var axisMax = controller.calculateAxisMaxValue(
                  controller.getVariableMax(variable)
                );
              }
              var variableValue = controller.getVariableValue(name, variable);
              var graphBarPercent = controller.calculateGraphPercent(
                variableValue,
                axisMax
              );
              var thresholdsArray = [100, 100]; // TODO

              var graph_data = {
                visibleValue: variableValue,
                graphBarPercent: graphBarPercent,
                thresholdsArray: thresholdsArray,
                barClass: controller.classifyGraphBarColour(
                  graphBarPercent,
                  thresholdsArray
                ),
                graph_axis: model.templates.graph_axis_template({
                  markers: controller.getAxisMarkers(variable),
                }),
                measure: variable,
                unit: 'todo',
              };
              multiple_variable_graph_items.push({
                graph_item: model.templates.graph_item_template(graph_data),
              });
            });
          }

          if (single_variable_graph_items.length) {
            // Single variable items go into one group
            graph_group_html = model.templates.graph_group_template({
              graph_items: single_variable_graph_items,
            });
          } else {
            // Multiple variable items
            graph_group_html += model.templates.graph_group_template({
              firstname: firstname,
              lastname: lastname,
              position: positionClass,
              graphGroupClass: 'extra-padding',
              graph_items: multiple_variable_graph_items,
            });
          }
        });

        return {
          html: graph_group_html,
          positionsArray: positionsArray,
        };
      },
      generateTitle: function (athletes_array, variables_array, variable_key) {
        if (!athletes_array.length || !variables_array.length) return;
        var titleHTML = '';
        if (variables_array.length == 0) {
          titleHTML = '0 variables';
        } else if (variables_array.length < 6) {
          $(variables_array).each(function (i, variable) {
            if (i > 0) titleHTML += ', ';
            titleHTML += variable;
          });
        } else {
          titleHTML += variables_array.length + ' variables';
        }

        titleHTML += '<br><span class="muted">';
        titleHTML +=
          '<input type="hidden" name="leroy_variable[' +
          variable_key +
          ']" value="' +
          variable_key +
          '" />';
        titleHTML +=
          athletes_array.length > 1
            ? athletes_array.length + ' athletes'
            : athletes_array[0].name;
        titleHTML += '</span>';
        return titleHTML;
      },
      createLegendItems: function (positionsArray) {
        var legendItemsHTML = '';
        var positions = model.graphData.positions;
        positionsArray.forEach(function (position) {
          legendItemsHTML += model.templates.legend_item({
            class: positions[position].class,
            label: positions[position].label,
          });
        });
        return legendItemsHTML;
      },
      getVariableValue: function (name, variable) {
        var value = '';
        model.graphData.playerDataArray.forEach(function (playerData) {
          if (playerData['athlete_name'] == name) {
            value = playerData[variable];
          }
        });
        return value;
      },
      getVariableMax: function (variable) {
        return model.graphData.highValues[variable];
      },
      getPositionClass: function (position) {
        return model.graphData.positions[position].class;
      },
      calculateSquadAverage: function (data) {
        var values = [];
        Object.keys(data.variablesArray).forEach(function (variable) {
          if (typeof values[variable] === 'undefined') {
            values[variable] = [];
          }
          data.playerDataArray.forEach(function (athlete) {
            if (athlete[variable]) {
              values[variable].push(athlete[variable]);
            }
          });
        });

        var output = [];
        Object.keys(data.variablesArray).forEach(function (variable) {
          output[variable] = window.average(values[variable]);
        });
        return output;
      },
      calculateSquadStandardDeviations: function (data) {
        var values = [];
        Object.keys(data.variablesArray).forEach(function (variable) {
          if (typeof values[variable] === 'undefined') {
            values[variable] = [];
          }
          data.playerDataArray.forEach(function (athlete) {
            if (athlete[variable]) {
              values[variable].push(athlete[variable]);
            }
          });
        });

        var output = [];
        Object.keys(data.variablesArray).forEach(function (variable) {
          output[variable] = standardDeviation(values[variable]);
        });
        return output;
      },
      calculatePositionAverage: function (data) {
        var values = [];
        Object.keys(data.variablesArray).forEach(function (variable) {
          data.playerDataArray.forEach(function (athlete) {
            if (typeof values[athlete.athlete_position] === 'undefined') {
              values[athlete.athlete_position] = [];
            }
            if (
              typeof values[athlete.athlete_position][variable] === 'undefined'
            ) {
              values[athlete.athlete_position][variable] = [];
            }
            if (athlete[variable]) {
              values[athlete.athlete_position][variable].push(
                athlete[variable]
              );
            }
          });
        });
        var output = [];
        Object.keys(values).forEach(function (position_key) {
          Object.keys(values[position_key]).forEach(function (variable_key) {
            var variable_values = values[position_key][variable_key];
            if (typeof output[position_key] === 'undefined') {
              output[position_key] = [];
            }
            if (typeof output[position_key][variable_key] === 'undefined') {
              output[position_key][variable_key] =
                window.average(variable_values);
            }
          });
        });
        return output;
      },
      calculatePositionStandardDeviations: function (data) {
        var values = [];
        Object.keys(data.variablesArray).forEach(function (variable) {
          data.playerDataArray.forEach(function (athlete) {
            if (typeof values[athlete.athlete_position] === 'undefined') {
              values[athlete.athlete_position] = [];
            }
            if (
              typeof values[athlete.athlete_position][variable] === 'undefined'
            ) {
              values[athlete.athlete_position][variable] = [];
            }
            if (athlete[variable]) {
              values[athlete.athlete_position][variable].push(
                athlete[variable]
              );
            }
          });
        });
        var output = [];
        Object.keys(values).forEach(function (position_key) {
          Object.keys(values[position_key]).forEach(function (variable_key) {
            var variable_values = values[position_key][variable_key];

            if (typeof output[position_key] === 'undefined') {
              output[position_key] = [];
            }
            if (typeof output[position_key][variable_key] === 'undefined') {
              output[position_key][variable_key] =
                standardDeviation(variable_values);
            }
          });
        });
        return output;
      },
      getAxisMarkers: function (variable) {
        // Get the axis markers for the requested variable, determined by the highest value in the data returned
        if (variable === 'workload_rpe') {
          if (model.graphData.rpeMax == 12.0) {
            // Special case for RPE
            return [
              { value: 12.0, height: 99 },
              { value: 10.0, height: 82.5 },
              { value: 8.0, height: 66.0 },
              { value: 6.0, height: 49.5 },
              { value: 4.0, height: 33.0 },
              { value: 2.0, height: 16.5 },
              { value: 0, height: 0 },
            ];
          } else {
            // Special case for RPE
            return [
              { value: 10, height: 99 },
              { value: 8, height: 80 },
              { value: 6, height: 60 },
              { value: 4, height: 40 },
              { value: 2, height: 20 },
              { value: 0, height: 0 },
            ];
          }
        } else {
          var max = controller.calculateAxisMaxValue(
            controller.getVariableMax(variable)
          );
          var mid = max * (2 / 3);
          var low = max * (1 / 3);

          if (max > 10) {
            mid = Math.floor(mid);
            low = Math.floor(low);
          } else {
            mid = controller.roundToTwo(mid);
            low = controller.roundToTwo(low);
          }
          return [
            { value: max, height: 99 },
            { value: mid, height: 66 },
            { value: low, height: 33 },
            { value: 0, height: 0 },
          ];
        }
      },
      calculateAxisMaxValue: function (max) {
        // Determine rounding based on how large the number is
        if (max > 1000) {
          // Up to the nearest thousand
          max = max * 1.01;
          max = Math.ceil(max / 1000) * 1000;
        } else if (max > 100) {
          // 1000 - 100
          // Up to the nearest fifty
          max = max * 1.01;
          max = Math.ceil(max / 50) * 50;
        } else if (max > 10) {
          // 100 - 10
          // Up to the nearest 5
          max = max * 1.01;
          max = Math.ceil(max / 5) * 5;
        } else if (max > 1) {
          // 10 - 1
          // Up to the nearest single digit
          max = max + 1;
        } else if (max > 0.5) {
          // 1 - 0.5
          max = 1;
        } else if (max > 0.2) {
          max = 0.5;
        } else if (max > 0.1) {
          max = 0.2;
        } else if (max > 0.01) {
          max = 0.1;
        }
        return max;
      },
      calculateGraphPercent: function (value, max) {
        return controller.roundToTwo((value / max) * 100);
      },
      calculateThresholdArrayByPercent: function (
        threshold_value,
        averagePercent
      ) {
        // Returns an array of values, the first being the lower bound and the second the middle bound
        if (threshold_value < 0) {
          threshold_value = -threshold_value;
        }
        return [
          controller.offsetByPercent(averagePercent, -threshold_value),
          controller.offsetByPercent(averagePercent, threshold_value),
        ];
      },
      offsetByPercent: function (value, percent) {
        return value * (1 + percent / 100);
      },
      calculateThresholdArrayByDeviation: function (
        threshold_value,
        deviation,
        averageValue,
        averagePercent
      ) {
        if (deviation) {
          // Use the deviation amount to establish what percent to offset the average value
          var percentageOffset =
            ((deviation * threshold_value) / averageValue) * 100;
          return [
            controller.offsetByPercent(averagePercent, -percentageOffset),
            controller.offsetByPercent(averagePercent, percentageOffset),
          ];
        } else {
          return [100, 100];
        }
      },
      classifyGraphBarColour: function (value, thresholdsArray) {
        // return one of "low", "medium" or "high"
        if (!thresholdsArray || thresholdsArray[0] === 100) return 'none';
        if (value < thresholdsArray[0]) return 'low';
        else if (value < thresholdsArray[1]) return 'medium';
        else return 'high';
      },
      roundToTwo: function (num) {
        var rounding = 2;
        return +(Math.round(num + 'e+' + rounding) + 'e-' + rounding);
      },
      enableApplyButton: function (graphContainer) {
        $(graphContainer).find('.edit-bar-apply').removeAttr('disabled');
      },
    }; // end controller

    controller.init();
  };

  $(function () {
    const leroyCharts = document.getElementsByClassName('leroy-charts');

    for (var i = 0; i < leroyCharts.length; i++) {
      const chartData = JSON.parse(leroyCharts[i].dataset.chartData);
      initLeroyGraphs(chartData);
    }
  });
};
