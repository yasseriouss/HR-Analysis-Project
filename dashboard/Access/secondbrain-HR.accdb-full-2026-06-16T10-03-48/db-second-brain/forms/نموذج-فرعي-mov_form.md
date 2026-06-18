# Form: نموذج فرعي mov_form

- RecordSource: "SELECT mov_form.[date no], mov_form.[NAME NO], mov_form.DAYS, mov_form.FACTION, "
- Controls: 11
- DefaultView: 2
- Modal: NotDefault
- PopUp: NotDefault

## Depends On

- None

## Controls

| Name | Type | Source | Caption | SubForm |
|---|---|---|---|---|
| NAME | TextBox | الاسم |  |  |
| DAYS | TextBox | DAYS |  |  |
| ADD_HOURS | TextBox | ADD_HOURS |  |  |
| نص22 | TextBox | =([ADD_HOURS]/8)+[DAYS] |  |  |
| نص27 | TextBox | اجرة اليومية |  |  |
| CONT_SALARY | TextBox | CONT_SALARY |  |  |
| PROCEDURE | TextBox | قيمة الاقتطاعات الاسبوعية |  |  |
| نص0 | TextBox | PROCEDURE |  |  |
| NAME NO | ComboBox | NAME NO |  |  |
| نص31 | TextBox | =Sum([CONT_SALARY]) |  |  |
| أمر38 | CommandButton |  | السجل الأخير |  |

## Code

```vb
Version =20
VersionRequired =20
PublishOption =1
Begin Form
    PopUp = NotDefault
    Modal = NotDefault
    RecordSelectors = NotDefault
    NavigationButtons = NotDefault
    DividingLines = NotDefault
    AllowDesignChanges = NotDefault
    DefaultView =2
    ScrollBars =2
    Orientation =1
    PictureAlignment =2
    DatasheetGridlinesBehavior =3
    GridY =10
    Width =6994
    DatasheetFontHeight =12
    DatasheetFontWeight =700
    ItemSuffix =2
    Left =5430
    Top =1635
    Right =20370
    Bottom =6825
    DatasheetBackColor =15921906
    DatasheetGridlinesColor =14806254
    RecordSource ="SELECT mov_form.[date no], mov_form.[NAME NO], mov_form.DAYS, mov_form.FACTION, "
        "mov_form.ADD_HOURS, mov_form.AQ_ASS, mov_form.AMM_ASS, [mov_form].[movment.PROCE"
        "DURE] AS Expr1, mov_form.takafol, mov_form.aytam, mov_form.الاسم, mov_form.[اجرة"
        " اليومية], mov_form.CONT_SALARY, mov_form.[قيمة الاقتطاعات الاسبوعية], mov_form."
        "movment.PROCEDURE FROM mov_form; "
    DatasheetFontName ="Arial"
    FilterOnLoad =0
    DatasheetBackColor12 =15921906
    ShowPageMargins =0
    DisplayOnSharePointSite =1
    DatasheetAlternateBackColor =16777215
    DatasheetGridlinesColor12 =789516
    FitToScreen =1
    DatasheetBackThemeColorIndex =1
    DatasheetBackShade =95.0
    BorderThemeColorIndex =3
    ThemeFontIndex =1
    ForeThemeColorIndex =0
    AlternateBackThemeColorIndex =1
    NoSaveCTIWhenDisabled =1
    Begin
        Begin Label
            BackStyle =0
            TextFontCharSet =178
            FontSize =11
            FontName ="Calibri"
            HorizontalAnchor =1
            ThemeFontIndex =1
            BackThemeColorIndex =1
            BorderThemeColorIndex =0
            BorderTint =50.0
            ForeThemeColorIndex =0
            ForeTint =50.0
            GridlineThemeColorIndex =1
            GridlineShade =65.0
        End
        Begin CommandButton
            TextFontCharSet =178
            Width =1701
            Height =283
            FontSize =11
            FontWeight =400
            FontName ="Calibri"
            HorizontalAnchor =1
            ForeThemeColorIndex =0
            ForeTint =75.0
            GridlineThemeColorIndex =1
            GridlineShade =65.0
            UseTheme =1
            Shape =1
            Gradient =12
            BackThemeColorIndex =4
            BackTint =60.0
            BorderLineStyle =0
            BorderColor =16777215
            BorderThemeColorIndex =4
            BorderTint =60.0
            ThemeFontIndex =1
            HoverThemeColorIndex =4
            HoverTint =40.0
            PressedThemeColorIndex =4
            PressedShade =75.0
            HoverForeThemeColorIndex =0
            HoverForeTint =75.0
            PressedForeThemeColorIndex =0
            PressedForeTint =75.0
        End
        Begin TextBox
            AddColon = NotDefault
            FELineBreak = NotDefault
            TextFontCharSet =178
            BorderLineStyle =0
            Width =1701
            LabelX =-1701
            FontSize =11
            FontName ="Calibri"
            AsianLineBreak =1
            HorizontalAnchor =1
            BackThemeColorIndex =1
            BorderThemeColorIndex =1
            BorderShade =65.0
            ThemeFontIndex =1
            ForeThemeColorIndex =0
            ForeTint =75.0
            GridlineThemeColorIndex =1
            GridlineShade =65.0
        End
        Begin ComboBox
            AddColon = NotDefault
            BorderLineStyle =0
            LabelX =-1800
            FontSize =11
            FontName ="Calibri"
            HorizontalAnchor =1
            AllowValueListEdits =1
            InheritValueList =1
            ThemeFontIndex =1
            BackThemeColorIndex =1
            BorderThemeColorIndex =1
            BorderShade =65.0
            ForeThemeColorIndex =2
            ForeShade =50.0
            GridlineThemeColorIndex =1
            GridlineShade =65.0
        End
        Begin FormHeader
            Height =0
            BackColor =15849926
            Name ="رأس_النموذج"
            AlternateBackThemeColorIndex =1
            AlternateBackShade =95.0
            BackThemeColorIndex =2
            BackTint =20.0
        End
        Begin Section
            Height =5952
            Name ="تفصيل"
            AutoHeight =1
            AlternateBackColor =15921906
            AlternateBackThemeColorIndex =1
            AlternateBackShade =95.0
            BackThemeColorIndex =1
            Begin
                Begin TextBox
                    Enabled = NotDefault
                    Locked = NotDefault
                    SpecialEffect =2
                    OverlapFlags =93
                    TextFontCharSet =0
                    IMESentenceMode =3
                    Left =1249
                    Top =342
                    Width =2310
                    Height =255
                    ColumnWidth =2400
                    ColumnOrder =1
                    FontSize =14
                    BackColor =-2147483643
                    ForeColor =-2147483640
                    Name ="NAME"
                    ControlSource ="الاسم"
                    StatusBarText ="الاسم"
                    FontName ="MS Sans Serif"
                    HorizontalAnchor =0

                    LayoutCachedLeft =1249
                    LayoutCachedTop =342
                    LayoutCachedWidth =3559
                    LayoutCachedHeight =597
                    BackThemeColorIndex =-1
                    BorderThemeColorIndex =-1
                    BorderShade =100.0
                    ThemeFontIndex =-1
                    ForeThemeColorIndex =-1
                    ForeTint =100.0
                    GridlineThemeColorIndex =-1
                    GridlineShade =100.0
                    Begin
                        Begin Label
                            OverlapFlags =85
                            TextFontCharSet =0
                            Left =3619
                            Top =342
                            Width =1560
                            Height =255
                            FontSize =14
                            BackColor =-2147483633
                            ForeColor =-2147483630
                            Name ="NAME_تسمية"
                            Caption ="اسم الموظف"
                            FontName ="MS Sans Serif"
                            HorizontalAnchor =0
                            LayoutCachedLeft =3619
                            LayoutCachedTop =342
                            LayoutCachedWidth =5179
                            LayoutCachedHeight =597
                            ThemeFontIndex =-1
                            BackThemeColorIndex =-1
                            BorderThemeColorIndex =-1
                            BorderTint =100.0
                            ForeThemeColorIndex =-1
                            ForeTint =100.0
                            GridlineThemeColorIndex =-1
                            GridlineShade =100.0
                        End
                    End
                End
                Begin TextBox
                    SpecialEffect =2
                    OverlapFlags =85
                    TextFontCharSet =0
                    TextAlign =2
                    NumeralShapes =1
                    IMESentenceMode =3
                    Left =1249
                    Top =684
                    Width =2310
                    Height =255
                    ColumnWidth =1125
                    ColumnOrder =2
                    FontSize =14
                    TabIndex =1
                    BackColor =-2147483643
                    ForeColor =-2147483640
                    Name ="DAYS"
                    ControlSource ="DAYS"
                    StatusBarText ="الايام"
                    FontName ="MS Sans Serif"
                    HorizontalAnchor =0

                    LayoutCachedLeft =1249
                    LayoutCachedTop =684
                    LayoutCachedWidth =3559
                    LayoutCachedHeight =939
                    BackThemeColorIndex =-1
                    BorderThemeColorIndex =-1
                    BorderShade =100.0
                    ThemeFontIndex =-1
                    ForeThemeColorIndex =-1
                    ForeTint =100.0
                    GridlineThemeColorIndex =-1
                    GridlineShade =100.0
                    Begin
                        Begin Label
                            OverlapFlags =85
                            TextFontCharSet =0
                            Left =3619
                            Top =684
                            Width =1560
                            Height =255
                            FontSize =14
                            BackColor =-2147483633
                            ForeColor =-2147483630
                            Name ="DAYS_تسمية"
                            Caption ="الايام"
                            FontName ="MS Sans Serif"
                            HorizontalAnchor =0
                            LayoutCachedLeft =3619
                            LayoutCachedTop =684
                            LayoutCachedWidth =5179
                            LayoutCachedHeight =939
                            ThemeFontIndex =-1
                            BackThemeColorIndex =-1
                            BorderThemeColorIndex =-1
                            BorderTint =100.0
                            ForeThemeColorIndex =-1
                            ForeTint =100.0
                            GridlineThemeColorIndex =-1
                            GridlineShade =100.0
                        End
                    End
                End
                Begin TextBox
                    DecimalPlaces =3
                    SpecialEffect =2
                    OverlapFlags =85
                    TextFontCharSet =0
                    TextAlign =2
                    NumeralShapes =1
                    IMESentenceMode =3
                    Left =1249
                    Top =1368
                    Width =2310
                    Height =255
                    ColumnWidth =1185
                    ColumnOrder =3
                    FontSize =14
                    TabIndex =2
                    BackColor =-2147483643
                    ForeColor =-2147483640
                    Name ="ADD_HOURS"
                    ControlSource ="ADD_HOURS"
                    Format ="General Number"
                    StatusBarText ="ساعات الاضافي"
                    FontName ="MS Sans Serif"
                    HorizontalAnchor =0

                    LayoutCachedLeft =1249
                    LayoutCachedTop =1368
                    LayoutCachedWidth =3559
                    LayoutCachedHeight =1623
                    BackThemeColorIndex =-1
                    BorderThemeColorIndex =-1
                    BorderShade =100.0
                    ThemeFontIndex =-1
                    ForeThemeColorIndex =-1
                    ForeTint =100.0
                    GridlineThemeColorIndex =-1
                    GridlineShade =100.0
                    Begin
                        Begin Label
                            OverlapFlags =85
                            TextFontCharSet =0
                            Left =3619
                            Top =1368
                            Width =1560
                            Height =255
                            FontSize =14
                            BackColor =-2147483633
                            ForeColor =-2147483630
                            Name ="ADD_HOURS_تسمية"
                            Caption ="س.اضافي"
                            FontName ="MS Sans Serif"
                            HorizontalAnchor =0
                            LayoutCachedLeft =3619
                            LayoutCachedTop =1368
                            LayoutCachedWidth =5179
                            LayoutCachedHeight =1623
                            ThemeFontIndex =-1
                            BackThemeColorIndex =-1
                            BorderThemeColorIndex =-1
                            BorderTint =100.0
                            ForeThemeColorIndex =-1
                            ForeTint =100.0
                            GridlineThemeColorIndex =-1
                            GridlineShade =100.0
                        End
                    End
                End
                Begin TextBox
                    Enabled = NotDefault
                    Locked = NotDefault
                    DecimalPlaces =3
                    SpecialEffect =2
                    OverlapFlags =85
                    TextFontCharSet =0
                    TextAlign =2
                    NumeralShapes =1
                    IMESentenceMode =3
                    Left =1418
                    Top =1925
                    Width =1418
                    Height =465
                    ColumnWidth =1590
                    ColumnOrder =4
                    FontSize =14
                    FontWeight =700
                    TabIndex =3
                    BackColor =-2147483643
                    ForeColor =255
                    Name ="نص22"
                    ControlSource ="=([ADD_HOURS]/8)+[DAYS]"
                    Format ="Standard"
                    FontName ="MS Sans Serif"
                    HorizontalAnchor =0

                    LayoutCachedLeft =1418
                    LayoutCachedTop =1925
                    LayoutCachedWidth =2836
                    LayoutCachedHeight =2390
                    BackThemeColorIndex =-1
                    BorderThemeColorIndex =-1
                    BorderShade =100.0
                    ThemeFontIndex =-1
                    ForeThemeColorIndex =-1
                    ForeTint =100.0
                    GridlineThemeColorIndex =-1
                    GridlineShade =100.0
                    Begin
                        Begin Label
                            OverlapFlags =85
                            TextFontCharSet =0
                            Left =3611
                            Top =1925
                            Width =930
                            Height =240
                            FontSize =8
                            BackColor =-2147483633
                            ForeColor =-2147483630
                            Name ="تسمية23"
                            Caption ="اجمالي الايام"
                            FontName ="MS Sans Serif"
                            HorizontalAnchor =0
                            LayoutCachedLeft =3611
                            LayoutCachedTop =1925
                            LayoutCachedWidth =4541
                            LayoutCachedHeight =2165
                            ThemeFontIndex =-1
                            BackThemeColorIndex =-1
                            BorderThemeColorIndex =-1
                            BorderTint =100.0
                            ForeThemeColorIndex =-1
                            ForeTint =100.0
                            GridlineThemeColorIndex =-1
                            GridlineShade =100.0
                        End
                    End
                End
                Begin TextBox
                    Enabled = NotDefault
                    Locked = NotDefault
                    DecimalPlaces =3
                    SpecialEffect =2
                    OverlapFlags =85
                    TextFontCharSet =0
                    TextAlign =2
                    NumeralShapes =1
                    IMESentenceMode =3
                    Left =1304
                    Top =3342
                    Width =1474
                    ColumnWidth =1500
                    ColumnOrder =5
                    FontSize =8
                    FontWeight =700
                    TabIndex =4
                    BackColor =-2147483643
                    ForeColor =255
                    Name ="نص27"
                    ControlSource ="اجرة اليومية"
                    Format ="Standard"
                    FontName ="MS Sans Serif"
                    HorizontalAnchor =0

                    LayoutCachedLeft =1304
                    LayoutCachedTop =3342
                    LayoutCachedWidth =2778
                    LayoutCachedHeight =3582
                    BackThemeColorIndex =-1
                    BorderThemeColorIndex =-1
                    BorderShade =100.0
                    ThemeFontIndex =-1
                    ForeThemeColorIndex =-1
                    ForeTint =100.0
                    GridlineThemeColorIndex =-1
                    GridlineShade =100.0
                    Begin
                        Begin Label
                            OverlapFlags =85
                            TextFontCharSet =0
                            Left =3506
                            Top =3342
                            Width =975
                            Height =240
                            FontSize =8
                            BackColor =-2147483633
                            ForeColor =-2147483630
                            Name ="تسمية28"
                            Caption ="يومية الموظف"
                            FontName ="MS Sans Serif"
                            HorizontalAnchor =0
                            LayoutCachedLeft =3506
                            LayoutCachedTop =3342
                            LayoutCachedWidth =4481
                            LayoutCachedHeight =3582
                            ThemeFontIndex =-1
                            BackThemeColorIndex =-1
                            BorderThemeColorIndex =-1
                            BorderTint =100.0
                            ForeThemeColorIndex =-1
                            ForeTint =100.0
                            GridlineThemeColorIndex =-1
                            GridlineShade =100.0
                        End
                    End
                End
                Begin TextBox
                    Enabled = NotDefault
                    Locked = NotDefault
                    DecimalPlaces =2
                    SpecialEffect =2
                    OverlapFlags =85
                    TextFontCharSet =0
                    TextAlign =2
                    NumeralShapes =1
                    IMESentenceMode =3
                    Top =3966
                    Width =1866
                    ColumnWidth =1560
                    ColumnOrder =6
                    FontSize =8
                    TabIndex =5
                    BackColor =-2147483643
                    ForeColor =-2147483640
                    Name ="CONT_SALARY"
                    ControlSource ="CONT_SALARY"
                    Format ="Fixed"
                    FontName ="MS Sans Serif"
                    HorizontalAnchor =0

                    LayoutCachedTop =3966
                    LayoutCachedWidth =1866
                    LayoutCachedHeight =4206
                    BackThemeColorIndex =-1
                    BorderThemeColorIndex =-1
                    BorderShade =100.0
                    ThemeFontIndex =-1
                    ForeThemeColorIndex =-1
                    ForeTint =100.0
                    GridlineThemeColorIndex =-1
                    GridlineShade =100.0
                    Begin
                        Begin Label
                            OverlapFlags =85
                            TextFontCharSet =0
                            Left =2112
                            Top =3966
                            Width =1290
                            Height =240
                            FontSize =8
                            BackColor =-2147483633
                            ForeColor =-2147483630
                            Name ="تسمية33"
                            Caption ="راتب الموظف"
                            FontName ="MS Sans Serif"
                            HorizontalAnchor =0
                            LayoutCachedLeft =2112
                            LayoutCachedTop =3966
                            LayoutCachedWidth =3402
                            LayoutCachedHeight =4206
                            ThemeFontIndex =-1
                            BackThemeColorIndex =-1
                            BorderThemeColorIndex =-1
                            BorderTint =100.0
                            ForeThemeColorIndex =-1
                            ForeTint =100.0
                            GridlineThemeColorIndex =-1
                            GridlineShade =100.0
                        End
                    End
                End
                Begin TextBox
                    SpecialEffect =2
                    OverlapFlags =85
                    TextFontCharSet =0
                    TextAlign =2
                    IMESentenceMode =3
                    Left =2040
                    Top =2435
                    Height =255
                    ColumnWidth =1590
                    ColumnOrder =7
                    FontSize =8
                    TabIndex =6
                    BackColor =-2147483643
                    ForeColor =-2147483640
                    Name ="PROCEDURE"
                    ControlSource ="قيمة الاقتطاعات الاسبوعية"
                    StatusBarText ="مأمور اجراء"
                    FontName ="MS Sans Serif"
                    HorizontalAnchor =0

                    LayoutCachedLeft =2040
                    LayoutCachedTop =2435
                    LayoutCachedWidth =3741
                    LayoutCachedHeight =2690
                    BackThemeColorIndex =-1
                    BorderThemeColorIndex =-1
                    BorderShade =100.0
                    ThemeFontIndex =-1
                    ForeThemeColorIndex =-1
                    ForeTint =100.0
                    GridlineThemeColorIndex =-1
                    GridlineShade =100.0
                    Begin
                        Begin Label
                            OverlapFlags =85
                            TextFontCharSet =0
                            Left =4096
                            Top =2435
                            Width =1140
                            Height =240
                            FontSize =8
                            BackColor =-2147483633
                            ForeColor =-2147483630
                            Name ="تسمية34"
                            Caption ="اجراء/خصم"
                            FontName ="MS Sans Serif"
                            HorizontalAnchor =0
                            LayoutCachedLeft =4096
                            LayoutCachedTop =2435
                            LayoutCachedWidth =5236
                            LayoutCachedHeight =2675
                            ThemeFontIndex =-1
                            BackThemeColorIndex =-1
                            BorderThemeColorIndex =-1
                            BorderTint =100.0
                            ForeThemeColorIndex =-1
                            ForeTint =100.0
                            GridlineThemeColorIndex =-1
                            GridlineShade =100.0
                        End
                    End
                End
                Begin TextBox
                    SpecialEffect =2
                    OverlapFlags =85
                    TextFontCharSet =0
                    TextAlign =2
                    IMESentenceMode =3
                    Left =2097
                    Top =2834
                    Height =255
                    ColumnWidth =2295
                    ColumnOrder =8
                    FontSize =8
                    TabIndex =7
                    BackColor =-2147483643
                    ForeColor =-2147483640
                    Name ="نص0"
                    ControlSource ="PROCEDURE"
                    StatusBarText ="مأمور اجراء"
                    FontName ="MS Sans Serif"
                    HorizontalAnchor =0

                    LayoutCachedLeft =2097
                    LayoutCachedTop =2834
                    LayoutCachedWidth =3798
                    LayoutCachedHeight =3089
                    BackThemeColorIndex =-1
                    BorderThemeColorIndex =-1
                    BorderShade =100.0
                    ThemeFontIndex =-1
                    ForeThemeColorIndex =-1
                    ForeTint =100.0
                    GridlineThemeColorIndex =-1
                    GridlineShade =100.0
                    Begin
                        Begin Label
                            OverlapFlags =85
                            TextFontCharSet =0
                            Left =4153
                            Top =2834
                            Width =1140
                            Height =240
                            FontSize =8
                            BackColor =-2147483633
                            ForeColor =-2147483630
                            Name ="تسمية1"
                            Caption ="خصم القسط"
                            FontName ="MS Sans Serif"
                            HorizontalAnchor =0
                            LayoutCachedLeft =4153
                            LayoutCachedTop =2834
                            LayoutCachedWidth =5293
                            LayoutCachedHeight =3074
                            ThemeFontIndex =-1
                            BackThemeColorIndex =-1
                            BorderThemeColorIndex =-1
                            BorderTint =100.0
                            ForeThemeColorIndex =-1
                            ForeTint =100.0
                            GridlineThemeColorIndex =-1
                            GridlineShade =100.0
                        End
                    End
                End
                Begin ComboBox
                    SpecialEffect =2
                    OverlapFlags =247
                    TextFontCharSet =178
                    TextAlign =2
                    IMESentenceMode =3
                    ColumnCount =2
                    ListWidth =10080
                    Left =2644
                    Width =915
                    Height =420
                    ColumnWidth =1395
                    ColumnOrder =0
                    FontSize =14
                    TabIndex =8
                    BackColor =-2147483643
                    BorderColor =855309
                    ForeColor =-2147483640
                    ColumnInfo ="\"\";\"\";\"\";\"\";\"4\";\"4\""
                    Name ="NAME NO"
                    ControlSource ="NAME NO"
                    RowSourceType ="Table/Query"
                    RowSource ="SELECT الموظفين.[رقم الوظيفي], الموظفين.الاسم FROM الموظفين; "
                    ColumnWidths ="4320"
                    StatusBarText ="الرقم"
                    FontName ="MS Sans Serif"
                    EventProcPrefix ="NAME_NO"
                    HorizontalAnchor =0

                    LayoutCachedLeft =2644
                    LayoutCachedWidth =3559
                    LayoutCachedHeight =420
                    ThemeFontIndex =-1
                    BackThemeColorIndex =-1
                    BorderThemeColorIndex =0
                    BorderTint =95.0
                    BorderShade =100.0
                    ForeThemeColorIndex =-1
                    ForeShade =100.0
                    GridlineThemeColorIndex =-1
                    GridlineShade =100.0
                    Begin
                        Begin Label
                            OverlapFlags =85
                            TextFontCharSet =0
                            Left =3619
                            Width =1560
                            Height =255
                            FontSize =14
                            BackColor =-2147483633
                            ForeColor =-2147483630
                            Name ="NAME NO_تسمية"
                            Caption ="رقم الموظف"
                            FontName ="MS Sans Serif"
                            EventProcPrefix ="NAME_NO_تسمية"
                            HorizontalAnchor =0
                            LayoutCachedLeft =3619
                            LayoutCachedWidth =5179
                            LayoutCachedHeight =255
                            ThemeFontIndex =-1
                            BackThemeColorIndex =-1
                            BorderThemeColorIndex =-1
                            BorderTint =100.0
                            ForeThemeColorIndex =-1
                            ForeTint =100.0
                            GridlineThemeColorIndex =-1
                            GridlineShade =100.0
                        End
                    End
                End
            End
        End
        Begin FormFooter
            Height =1279
            Name ="تذييل_النموذج"
            AutoHeight =1
            AlternateBackThemeColorIndex =1
            AlternateBackShade =95.0
            BackThemeColorIndex =1
            Begin
                Begin TextBox
                    SpecialEffect =2
                    OverlapFlags =85
                    TextFontCharSet =0
                    IMESentenceMode =3
                    Left =219
                    Width =2677
                    Height =435
                    FontSize =8
                    BackColor =-2147483643
                    ForeColor =-2147483640
                    Name ="نص31"
                    ControlSource ="=Sum([CONT_SALARY])"
                    FontName ="MS Sans Serif"
                    HorizontalAnchor =0

                    LayoutCachedLeft =219
                    LayoutCachedWidth =2896
                    LayoutCachedHeight =435
                    BackThemeColorIndex =-1
                    BorderThemeColorIndex =-1
                    BorderShade =100.0
                    ThemeFontIndex =-1
                    ForeThemeColorIndex =-1
                    ForeTint =100.0
                    GridlineThemeColorIndex =-1
                    GridlineShade =100.0
                    Begin
                        Begin Label
                            OverlapFlags =85
                            TextFontCharSet =0
                            Left =3727
                            Width =525
                            Height =240
                            FontSize =8
                            BackColor =-2147483633
                            ForeColor =-2147483630
                            Name ="تسمية32"
                            Caption ="نص31:"
                            FontName ="MS Sans Serif"
                            HorizontalAnchor =0
                            LayoutCachedLeft =3727
                            LayoutCachedWidth =4252
                            LayoutCachedHeight =240
                            ThemeFontIndex =-1
                            BackThemeColorIndex =-1
                            BorderThemeColorIndex =-1
                            BorderTint =100.0
                            ForeThemeColorIndex =-1
                            ForeTint =100.0
                            GridlineThemeColorIndex =-1
                            GridlineShade =100.0
                        End
                    End
                End
                Begin CommandButton
                    OverlapFlags =85
                    TextFontCharSet =0
                    Left =1644
                    Top =964
                    Width =1005
                    Height =315
                    FontSize =8
                    TabIndex =1
                    Name ="أمر38"
                    Caption ="السجل الأخير"
                    FontName ="MS Sans Serif"
                    HorizontalAnchor =0

                    LayoutCachedLeft =1644
                    LayoutCachedTop =964
                    LayoutCachedWidth =2649
                    LayoutCachedHeight =1279
                    ForeThemeColorIndex =-1
                    ForeTint =100.0
                    GridlineThemeColorIndex =-1
                    GridlineShade =100.0
                    UseTheme =0
                    Shape =0
                    Gradient =0
                    BackThemeColorIndex =-1
                    BackTint =100.0
                    BorderColor =0
                    BorderThemeColorIndex =-1
                    BorderTint =100.0
                    ThemeFontIndex =-1
                    HoverThemeColorIndex =-1
                    HoverTint =100.0
                    PressedThemeColorIndex =-1
                    PressedShade =100.0
                    HoverForeThemeColorIndex =-1
                    HoverForeTint =100.0
                    PressedForeThemeColorIndex =-1
                    PressedForeTint =100.0
                    WebImagePaddingLeft =2
                    WebImagePaddingTop =2
                    WebImagePaddingRight =1
                    WebImagePaddingBottom =1
                    Overlaps =1
                End
            End
        End
    End
End
```


## Links

- None

## Referenciado por

- [[_critical-objects]]
- [[_dependencies]]
