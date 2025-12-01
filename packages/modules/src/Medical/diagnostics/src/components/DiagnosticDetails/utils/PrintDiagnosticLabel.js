// @flow

/**
 * Predefined XML for a Diagnostic specimen label
 * This is fed to a DYMO-specfic service that prints said label
 * @params:
 *  athleteName -- truncated athlete name,
    clientNumber -- short_external_id that lives on athlete obj,
    orderNumber --  redox_order_number that lives on redox_results call,
 */

const printDiagnosticLabel = ({
  clientNumber,
  orderNumber,
  athleteName,
}: {
  clientNumber: string,
  orderNumber: string,
  athleteName: string,
}): string => `<?xml version="1.0" encoding="utf-8"?>
    <DesktopLabel Version="1">
      <DYMOLabel Version="3">
        <Description>DYMO Label</Description>
        <Orientation>Landscape</Orientation>
        <LabelName>ReturnAddressS0722550</LabelName>
        <InitialLength>0</InitialLength>
        <BorderStyle>SolidLine</BorderStyle>
        <DYMORect>
          <DYMOPoint>
            <X>0.2266667</X>
            <Y>0.05666666</Y>
          </DYMOPoint>
          <Size>
            <Width>1.713333</Width>
            <Height>0.6533333</Height>
          </Size>
        </DYMORect>
        <BorderColor>
          <SolidColorBrush>
            <Color A="1" R="0" G="0" B="0"></Color>
          </SolidColorBrush>
        </BorderColor>
        <BorderThickness>1</BorderThickness>
        <Show_Border>False</Show_Border>
        <DynamicLayoutManager>
          <RotationBehavior>ClearObjects</RotationBehavior>
          <LabelObjects>
            <TextObject>
              <Name>ITextObject0</Name>
              <Brushes>
                <BackgroundBrush>
                  <SolidColorBrush>
                    <Color A="0" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </BackgroundBrush>
                <BorderBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </BorderBrush>
                <StrokeBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </StrokeBrush>
                <FillBrush>
                  <SolidColorBrush>
                    <Color A="0" R="0" G="0" B="0"></Color>
                  </SolidColorBrush>
                </FillBrush>
              </Brushes>
              <Rotation>Rotation0</Rotation>
              <OutlineThickness>1</OutlineThickness>
              <IsOutlined>False</IsOutlined>
              <BorderStyle>SolidLine</BorderStyle>
              <Margin>
                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
              </Margin>
              <HorizontalAlignment>Left</HorizontalAlignment>
              <VerticalAlignment>Middle</VerticalAlignment>
              <FitMode>AlwaysFit</FitMode>
              <IsVertical>False</IsVertical>
              <FormattedText>
                <FitMode>AlwaysFit</FitMode>
                <HorizontalAlignment>Left</HorizontalAlignment>
                <VerticalAlignment>Middle</VerticalAlignment>
                <IsVertical>False</IsVertical>
                <LineTextSpan>
                  <TextSpan>
                    <Text>Client &#35;: ${clientNumber}</Text>
                    <FontInfo>
                      <FontName>Arial</FontName>
                      <FontSize>9.3</FontSize>
                      <IsBold>False</IsBold>
                      <IsItalic>False</IsItalic>
                      <IsUnderline>False</IsUnderline>
                      <FontBrush>
                        <SolidColorBrush>
                          <Color A="1" R="0" G="0" B="0"></Color>
                        </SolidColorBrush>
                      </FontBrush>
                    </FontInfo>
                  </TextSpan>
                </LineTextSpan>
                <LineTextSpan>
                  <TextSpan>
                    <Text>Lab Ref &#35;: ${orderNumber}</Text>
                    <FontInfo>
                      <FontName>Arial</FontName>
                      <FontSize>9.3</FontSize>
                      <IsBold>False</IsBold>
                      <IsItalic>False</IsItalic>
                      <IsUnderline>False</IsUnderline>
                      <FontBrush>
                        <SolidColorBrush>
                          <Color A="1" R="0" G="0" B="0"></Color>
                        </SolidColorBrush>
                      </FontBrush>
                    </FontInfo>
                  </TextSpan>
                </LineTextSpan>
                <LineTextSpan>
                  <TextSpan>
                    <Text>Pat Name: ${athleteName}</Text>
                    <FontInfo>
                      <FontName>Arial</FontName>
                      <FontSize>9.3</FontSize>
                      <IsBold>False</IsBold>
                      <IsItalic>False</IsItalic>
                      <IsUnderline>False</IsUnderline>
                      <FontBrush>
                        <SolidColorBrush>
                          <Color A="1" R="0" G="0" B="0"></Color>
                        </SolidColorBrush>
                      </FontBrush>
                    </FontInfo>
                  </TextSpan>
                </LineTextSpan>
              </FormattedText>
              <ObjectLayout>
                <DYMOPoint>
                  <X>0.2266666</X>
                  <Y>0.05666666</Y>
                </DYMOPoint>
                <Size>
                  <Width>1.513656</Width>
                  <Height>0.6233333</Height>
                </Size>
              </ObjectLayout>
            </TextObject>
          </LabelObjects>
        </DynamicLayoutManager>
      </DYMOLabel>
      <LabelApplication>Blank</LabelApplication>
      <DataTable>
        <Columns></Columns>
        <Rows></Rows>
      </DataTable>
    </DesktopLabel>`;

export default printDiagnosticLabel;
