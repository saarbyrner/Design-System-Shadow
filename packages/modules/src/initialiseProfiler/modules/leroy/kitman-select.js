/* eslint-disable */
import Handlebars from 'handlebars';

export default () => {
  /* KITMAN SELECT */
  window.kitmanSelect = function () {
    var menuSelectMenuZindex = 10;

    var model = {
      // Holds the templates
    };
    var controller = {
      init: function () {
        // Set up the templates
        model.templates = {
          container: Handlebars.compile($('#kitman-select-container').html()),
          optgroup: Handlebars.compile($('#kitman-select-optgroup').html()),
          option: Handlebars.compile($('#kitman-select-option').html()),
        };
        // Apply the templates to the existing selects on the page
        $('select.kitman-select').each(function (i, thisSelect) {
          // Clear the selects first
          controller.build(i, thisSelect);
        });
        controller.attachKitmanSelectListeners();
      },
      build: function (i, select) {
        $(select).parent().find('.kitman-select-ui').remove();
        var label = $(select).data('label') || 'item';
        var selectID = $(select).data('label') + i;
        var multipleClass = $(select).attr('multiple') || '';
        $(select).attr('id', selectID);
        // Build up list of options
        var optionsGroupsHTML = controller.buildOptionsListHTML(
          select,
          model.templates
        );
        var totalSelected = $(optionsGroupsHTML).find(
          '.kitman-select-item.selected'
        ).length;
        var containerHTML = model.templates.container({
          totalSelected: controller.generateTotalText(totalSelected, label),
          selectID: selectID,
          multipleClass: multipleClass,
          optionsGroupsHTML: optionsGroupsHTML,
        });
        $(select).after(containerHTML);
        // Get the newly generated select list and pass it to the update text method
        var newSelect = $(select).parent().find('.kitman-select-items');
        controller.updateSelectText(newSelect);
        $(select).css('display', 'none');
      },
      buildOptionsListHTML: function (select, templates) {
        if ($(select).find('optgroup').length) {
          // Get each group as HTML
          var groupHTML = '';
          var optionIndex = 0;
          $(select)
            .find('optgroup')
            .each(function (groupIndex, group) {
              var options = controller.getOptions(
                group,
                templates,
                optionIndex
              );
              optionIndex += options.optionIndex;
              // Wrap them in optgroup html
              groupHTML += templates.optgroup({
                optionsHTML: options.optionsHTML,
                optgroupLabel: $(group).attr('label'),
              });
            });
          return groupHTML;
        } else {
          return controller.getOptions(select, templates, optionIndex)
            .optionsHTML;
        }
      },
      getOptions: function (container, templates, optionIndex) {
        var optionsHTML = '';
        var optionIndex = optionIndex || 0;
        $(container)
          .find('option')
          .each(function (i, option) {
            optionsHTML += templates.option({
              optionText: $(option).text(),
              optionIndex: optionIndex,
              optionSelected: $(option).attr('selected'),
            });
            optionIndex++;
          });
        // Had to specify keys. poltergeist was returning JS error. Will need addressing
        return { optionsHTML: optionsHTML, optionIndex: optionIndex };
      },
      attachKitmanSelectListeners: function () {
        $('.kitman-select-ui .selected-text').on(
          'click',
          controller.toggleList
        );
        $('.kitman-select-ui .kitman-select-item').on(
          'click',
          controller.toggleItemSelected
        );
        $('.kitman-select-ui .toggle-list').on('click', controller.toggleList);
        $('.kitman-select-ui .optgroup').on('click', controller.selectGroup);
      },
      toggleItemSelected: function (e) {
        // Toggle an item's selected state on click
        var targetItem = $(e.target);
        if (targetItem.closest('.kitman-select-ui').hasClass('multiple')) {
          targetItem.toggleClass('selected');
        } else {
          // Unselect the other items
          $(e.target)
            .parent()
            .find('.kitman-select-item')
            .removeClass('selected');
          // Select this item
          targetItem.toggleClass('selected');
          // Close the list
          controller.toggleList(e);
        }
        // Reflect the changes on the source select
        controller.updateSelectContents(e);
        // Update the text in the select
        controller.updateSelectText(e);
      },
      updateSelectText: function (e) {
        if ($(e.target).length == 0) {
          var target = $(e);
        } else {
          var target = $(e.target);
        }
        var container = target.closest('.kitman-select-container');
        var targetID = $(container).data('for');
        var isMultiple = controller.isMultiple($('#' + targetID));
        var textSelectedDiv = $(container).find('.selected-text');
        var label = $('#' + targetID).data('label');
        if (isMultiple) {
          var total = $(container).find('.kitman-select-item.selected').length;
          $(textSelectedDiv).text(controller.generateTotalText(total, label));
        } else {
          // Update the single item from the list
          var selectedText = $(container)
            .find('.kitman-select-item.selected')
            .text();
          if (selectedText === '') {
            $(textSelectedDiv).text(controller.generateTotalText(0, label));
          } else {
            $(textSelectedDiv).text(selectedText);
          }
        }
      },
      generateTotalText: function (total, label) {
        var plural = total == 1 ? '' : 's';
        if (total > 0) {
          return total + ' selected';
        } else {
          return 'Select ' + label;
        }
      },
      toggleList: function (e) {
        // Show the list of items
        var container = $(e.target).closest('.kitman-select-container');
        container.find('.kitman-select-items').toggleClass('show');
        // Toggle active state of the check box container
        container.find('.toggle-list').toggleClass('active');
        // Toggle the background on the total text
        container.find('.total-selected').toggleClass('nobg');

        // Increment zIndex on menu everytime it is toggled
        // this means the most recent will always be on top
        menuSelectMenuZindex++;
        container.css({ zIndex: menuSelectMenuZindex });
      },
      updateSelectContents: function (e) {
        // Update the selected items in the actual HTML select
        var container = $(e.target).closest('.kitman-select-container');
        var targetID = $(container).data('for');
        var selectOptions = $('#' + targetID).find('option');
        var kitmanSelectItems = $(container).find('.kitman-select-item');
        $(kitmanSelectItems).each(function (i, item) {
          // Get the source index integer and update the selected status
          var sourceIndex = $(item).data('source-index');
          if ($(item).hasClass('selected')) {
            $(selectOptions[sourceIndex]).attr('selected', true);
          } else if (sourceIndex !== undefined) {
            $(selectOptions[sourceIndex]).attr('selected', false);
          }
        });
        $('#' + targetID).trigger('change');
      },
      selectGroup: function (e) {
        var container = $(e.target).parent();
        var items = $(container).find('.kitman-select-item');
        if (
          items.length ==
          $(container).find('.kitman-select-item.selected').length
        ) {
          // All selected, so remove the selection
          $(items).removeClass('selected');
        } else {
          $(items).addClass('selected');
        }
        controller.updateTotalText(e);
        controller.updateSelectContents(e);
      },
      isMultiple: function (select) {
        return $(select).attr('multiple') === 'multiple';
      },
    };
    return controller;
  };
};
