// @flow

export default class DymoPrinterXMLParser {
  parseFromString(xmlText: string) {
    this.encodeCDATAValues(xmlText);
    const cleanXmlText = xmlText
      .replace(/\s{2,}/g, ' ')
      .replace(/\\t\\n\\r/g, '')
      .replace(/>/g, '>\n')
      .replace(/\]\]/g, ']]\n');
    const rawXmlData = [];

    cleanXmlText.split('\n').forEach((element) => {
      element.trim();

      if (!element || element.indexOf('?xml') > -1) {
        return;
      }

      if (element.indexOf('<') === 0 && element.indexOf('CDATA') < 0) {
        const parsedTag = this.parseTag(element);

        rawXmlData.push(parsedTag);

        if (element.match(/\/\s*>$/)) {
          if (typeof parsedTag.name === 'string')
            rawXmlData.push(this.parseTag(`</ ${parsedTag.name} >`));
        }
      } else {
        rawXmlData[rawXmlData.length - 1].value += ` ${this.parseValue(
          element
        )}`;
      }
    });

    return this.convertTagsArrayToTree(rawXmlData)[0];
  }

  encodeCDATAValues(xmlText: string) {
    const cdataRegex = new RegExp(/<!\[CDATA\[([^\]\]]+)\]\]/gi);
    let result = cdataRegex.exec(xmlText);
    while (result) {
      if (result.length > 1) {
        xmlText.replace(result[1], encodeURIComponent(result[1]));
      }

      result = cdataRegex.exec(xmlText);
    }

    return xmlText;
  }

  getElementsByTagName(tagName: any) {
    let matches = [];

    // $FlowIgnore
    if (tagName === '*' || this.name.toLowerCase() === tagName.toLowerCase()) {
      matches.push(this);
    }

    // $FlowIgnore
    this.children.forEach((child) => {
      matches = matches.concat(child.getElementsByTagName(tagName));
    });

    return matches;
  }

  parseTag(tagText: string) {
    const cleanTagText = tagText.match(
      // eslint-disable-next-line no-useless-escape
      /([^\s]*)=('([^']*?)'|"([^"]*?)")|([\/?\w\-\:]+)/g
    );

    const tag = {
      name: cleanTagText?.shift().replace(/\/\s*$/, ''),
      attributes: {},
      children: [],
      value: '',
      getElementsByTagName: this.getElementsByTagName,
    };

    cleanTagText?.forEach((attribute) => {
      let attributeKeyVal = attribute.split('=');

      if (attributeKeyVal.length < 2) {
        return;
      }

      const attributeKey = attributeKeyVal[0];
      let attributeVal = '';

      if (attributeKeyVal.length === 2) {
        attributeVal = attributeKeyVal[1];
      } else {
        attributeKeyVal = attributeKeyVal.slice(1);
        attributeVal = attributeKeyVal.join('=');
      }

      tag.attributes[attributeKey] =
        typeof attributeVal === 'string'
          ? attributeVal
              .replace(/^"/g, '')
              .replace(/^'/g, '')
              .replace(/"$/g, '')
              .replace(/'$/g, '')
              .trim()
          : attributeVal;
    });

    return tag;
  }

  parseValue(tagValue: string) {
    if (tagValue.indexOf('CDATA') < 0) {
      return tagValue.trim();
    }

    return tagValue.substring(
      tagValue.lastIndexOf('[') + 1,
      tagValue.indexOf(']')
    );
  }

  convertTagsArrayToTree(xml: any) {
    const xmlTree = [];

    while (xml.length > 0) {
      const tag = xml.shift();

      if (tag.value.indexOf('</') > -1 || tag.name?.match(/\/$/)) {
        tag.name = tag.name?.replace(/\/$/, '').trim();
        tag.value = tag.value.substring(0, tag.value.indexOf('</')).trim();
        xmlTree.push(tag);
      }

      if (tag.name?.indexOf('/') === 0) {
        break;
      }

      xmlTree.push(tag);
      tag.children = this.convertTagsArrayToTree(xml);
      tag.value = decodeURIComponent(tag.value.trim());
    }
    return xmlTree;
  }

  toString(xml: Object) {
    let xmlText = this.convertTagToText(xml);

    if (xml.children.length > 0) {
      xml.children.forEach((child) => {
        xmlText += this.toFormattedString(child);
      });

      xmlText += `</ ${xml.name} >`;
    }

    return xmlText;
  }

  convertTagToText(tag: Object) {
    let tagText = `< ${tag.name}`;
    // var attributesText = [];

    tag.attributes.forEach((attribute) => {
      tagText += ` ${attribute} = ${tag.attributes[attribute]} "`;
    });

    if (tag.value.length > 0) {
      tagText += `> ${tag.value}`;
    } else {
      tagText += `>`;
    }

    if (tag.children.length === 0) {
      tagText += `</ ${tag.name} >`;
    }

    return tagText;
  }

  toFormattedString(xml: string) {
    return this.toString(xml);
  }
}
