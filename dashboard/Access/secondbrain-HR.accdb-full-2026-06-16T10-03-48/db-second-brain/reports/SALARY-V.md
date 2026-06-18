# Report: SALARY V

- RecordSource: "all inq_1"
- Controls: 27
- DefaultView: 0
- Modal: NotDefault
- PopUp: NotDefault

## Depends On

- [[queries/all-inq_1]]

## Controls

| Name | Type | Source | Caption | SubForm |
|---|---|---|---|---|
| تسمية6 | Label |  | اقتطاعات |  |
| تسمية51 | Label |  | الصافي |  |
| NAME NO | TextBox | رقم الوظيفي |  |  |
| NAME | TextBox | الاسم |  |  |
| section | TextBox | القسم |  |  |
| sal_day | TextBox | اجرة اليومية |  |  |
| DAYS | TextBox | DAYS |  |  |
| ADD_HOURS | TextBox | ADD_HOURS |  |  |
| نص43 | TextBox | =(((([sal_day]*30)+[بدل غلاء معيشة]+[خصم بدل تأمين الصحي])/30)/8)*[ADD_HOURS] |  |  |
| NAME NO_تسمية | Label |  | الرقم |  |
| NAME_تسمية | Label |  | الاسم |  |
| section_تسمية | Label |  | القسم |  |
| sal_day_تسمية | Label |  | اليومية |  |
| DAYS_تسمية | Label |  | الايام |  |
| ADD_HOURS_تسمية | Label |  | ساعات الاضافي |  |
| تسمية45 | Label |  | قيمة الاضافي |  |
| مربع/خانة4 | Rectangle |  |  |  |
| مربع/خانة5 | Rectangle |  |  |  |
| تسمية7 | Label |  | قسيمة الراتب / الموظفين |  |
| date no | TextBox | date no |  |  |
| BANK NAME | TextBox | اسم البنك |  |  |
| EMP_TOTAL_SAL | TextBox | EMP_TOTAL_SAL |  |  |
| PROCEDURE | TextBox | PROCEDURE |  |  |
| SPONSORED | TextBox | قيمة الاقتطاعات الاسبوعية |  |  |
| تسمية3 | Label |  | اجراء/خصم |  |
| تسمية4 | Label |  | قيمة الاقتطاعات |  |
| شعار | Subform |  |  |  |

## Code

```vb
Version =21
VersionRequired =20
Begin Report
    LayoutForPrint = NotDefault
    PopUp = NotDefault
    Modal = NotDefault
    AllowDesignChanges = NotDefault
    DefaultView =0
    TabularCharSet =178
    TabularFamily =48
    DateGrouping =1
    GrpKeepTogether =1
    PictureAlignment =2
    DatasheetGridlinesBehavior =3
    GridX =20
    GridY =24
    Width =7398
    DatasheetFontHeight =10
    ItemSuffix =9
    Left =3150
    Top =1320
    Right =20235
    Bottom =10335
    DatasheetGridlinesColor =12632256
    RecordSource ="all inq_1"
    DatasheetFontName ="Arial"
    FilterOnLoad =0
    DatasheetGridlinesColor12 =12632256
    NoSaveCTIWhenDisabled =1
    Begin
        Begin Label
            BackStyle =0
            TextFontFamily =2
            FontName ="Arial"
        End
        Begin Rectangle
            BorderLineStyle =0
        End
        Begin Image
            OldBorderStyle =0
            BorderLineStyle =0
            SizeMode =3
            PictureAlignment =2
            Width =1701
            Height =1701
        End
        Begin TextBox
            AutoLabel = NotDefault
            FELineBreak = NotDefault
            OldBorderStyle =0
            BorderLineStyle =0
            FontWeight =300
            FontName ="Arial"
            AsianLineBreak =255
            ShowDatePicker =0
        End
        Begin Subform
            BorderLineStyle =0
            Width =1701
            Height =1701
            GridlineThemeColorIndex =1
            GridlineShade =65.0
        End
        Begin BreakLevel
            GroupHeader = NotDefault
            ControlSource ="NAME NO"
        End
        Begin PageHeader
            Height =0
            Name ="PageHeaderSection"
        End
        Begin BreakHeader
            KeepTogether = NotDefault
            CanGrow = NotDefault
            CanShrink = NotDefault
            Height =0
            Name ="رأس_المجموعة0"
        End
        Begin Section
            KeepTogether = NotDefault
            CanGrow = NotDefault
            Height =4181
            Name ="Detail"
            Begin
                Begin Label
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    TextFontFamily =34
                    Left =1050
                    Top =1770
                    Width =2010
                    Height =945
                    FontSize =10
                    FontWeight =700
                    ForeColor =8388608
                    Name ="تسمية6"
                    Caption ="اقتطاعات"
                    FontName ="Arial (Arabic)"
                    Tag ="DetachedLabel"
                    LayoutCachedLeft =1050
                    LayoutCachedTop =1770
                    LayoutCachedWidth =3060
                    LayoutCachedHeight =2715
                End
                Begin Label
                    FontItalic = NotDefault
                    BackStyle =1
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    TextFontFamily =0
                    Left =5107
                    Top =2970
                    Width =810
                    Height =390
                    FontSize =14
                    FontWeight =700
                    ForeColor =8388608
                    Name ="تسمية51"
                    Caption ="الصافي"
                    FontName ="Arial (Arabic)"
                    Tag ="DetachedLabel"
                    LayoutCachedLeft =5107
                    LayoutCachedTop =2970
                    LayoutCachedWidth =5917
                    LayoutCachedHeight =3360
                End
                Begin TextBox
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    BackStyle =0
                    IMESentenceMode =3
                    Left =6450
                    Top =1207
                    Width =669
                    Height =360
                    ColumnOrder =10
                    FontSize =10
                    FontWeight =700
                    Name ="NAME NO"
                    ControlSource ="رقم الوظيفي"
                    StatusBarText ="الرقم"
                    FontName ="Arial (Arabic)"
                    EventProcPrefix ="NAME_NO"

                End
                Begin TextBox
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    BackStyle =0
                    IMESentenceMode =3
                    Left =3540
                    Top =1207
                    Width =2901
                    Height =360
                    ColumnOrder =9
                    FontSize =12
                    FontWeight =700
                    TabIndex =1
                    Name ="NAME"
                    ControlSource ="الاسم"
                    StatusBarText ="الاسم"
                    FontName ="Arial (Arabic)"

                End
                Begin TextBox
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    BackStyle =0
                    IMESentenceMode =3
                    Left =2402
                    Top =1214
                    Width =1026
                    Height =360
                    ColumnOrder =8
                    FontSize =10
                    FontWeight =700
                    TabIndex =2
                    Name ="section"
                    ControlSource ="القسم"
                    FontName ="Arial (Arabic)"

                End
                Begin TextBox
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    BackStyle =0
                    IMESentenceMode =3
                    Left =6330
                    Top =2450
                    Width =801
                    Height =225
                    ColumnOrder =7
                    FontWeight =700
                    TabIndex =3
                    Name ="sal_day"
                    ControlSource ="اجرة اليومية"
                    StatusBarText ="اليومية"
                    FontName ="Arial (Arabic)"

                    LayoutCachedLeft =6330
                    LayoutCachedTop =2450
                    LayoutCachedWidth =7131
                    LayoutCachedHeight =2675
                End
                Begin TextBox
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    BackStyle =0
                    IMESentenceMode =3
                    Left =5355
                    Top =2450
                    Width =981
                    Height =225
                    ColumnOrder =6
                    FontWeight =700
                    TabIndex =4
                    Name ="DAYS"
                    ControlSource ="DAYS"
                    StatusBarText ="الايام"
                    FontName ="Arial (Arabic)"

                    LayoutCachedLeft =5355
                    LayoutCachedTop =2450
                    LayoutCachedWidth =6336
                    LayoutCachedHeight =2675
                End
                Begin TextBox
                    DecimalPlaces =3
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    IMESentenceMode =3
                    Left =4515
                    Top =2445
                    Width =816
                    Height =225
                    ColumnOrder =5
                    FontWeight =700
                    TabIndex =5
                    Name ="ADD_HOURS"
                    ControlSource ="ADD_HOURS"
                    StatusBarText ="ساعات الاضافي"
                    FontName ="Arial (Arabic)"
                    ConditionalFormat = Begin
                        0x0100000066000000010000000000000002000000000000000200000001000000 ,
                        0x00000000ffffff00000000000000000000000000000000000000000000000000 ,
                        0x0000000000000000000000000000000000000000000000000000000000000000 ,
                        0x300000000000
                    End

                    LayoutCachedLeft =4515
                    LayoutCachedTop =2445
                    LayoutCachedWidth =5331
                    LayoutCachedHeight =2670
                    ConditionalFormat14 = Begin
                        0x01000100000000000000020000000100000000000000ffffff00010000003000 ,
                        0x000000000000000000000000000000000000000000
                    End
                End
                Begin TextBox
                    DecimalPlaces =3
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    IMESentenceMode =3
                    Left =3585
                    Top =2445
                    Width =900
                    Height =225
                    ColumnOrder =4
                    FontWeight =700
                    TabIndex =6
                    Name ="نص43"
                    ControlSource ="=(((([sal_day]*30)+[بدل غلاء معيشة]+[خصم بدل تأمين الصحي])/30)/8)*[ADD_HOURS]"
                    Format ="Standard"
                    FontName ="Arial (Arabic)"
                    ConditionalFormat = Begin
                        0x0100000066000000010000000000000002000000000000000200000001000000 ,
                        0x00000000c0c0c000000000000000000000000000000000000000000000000000 ,
                        0x0000000000000000000000000000000000000000000000000000000000000000 ,
                        0x300000000000
                    End

                    LayoutCachedLeft =3585
                    LayoutCachedTop =2445
                    LayoutCachedWidth =4485
                    LayoutCachedHeight =2670
                    ConditionalFormat14 = Begin
                        0x01000100000000000000020000000100000000000000c0c0c000010000003000 ,
                        0x000000000000000000000000000000000000000000
                    End
                End
                Begin Label
                    FontItalic = NotDefault
                    BackStyle =1
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    TextFontFamily =34
                    Left =6433
                    Top =540
                    Width =669
                    Height =570
                    FontSize =11
                    FontWeight =700
                    ForeColor =8388608
                    Name ="NAME NO_تسمية"
                    Caption ="الرقم"
                    FontName ="Arial (Arabic)"
                    Tag ="DetachedLabel"
                    EventProcPrefix ="NAME_NO_تسمية"
                End
                Begin Label
                    FontItalic = NotDefault
                    BackStyle =1
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    TextFontFamily =34
                    Left =3538
                    Top =540
                    Width =2895
                    Height =570
                    FontSize =11
                    FontWeight =700
                    ForeColor =8388608
                    Name ="NAME_تسمية"
                    Caption ="الاسم"
                    FontName ="Arial (Arabic)"
                    Tag ="DetachedLabel"
                End
                Begin Label
                    FontItalic = NotDefault
                    BackStyle =1
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    TextFontFamily =34
                    Left =2400
                    Top =532
                    Width =1041
                    Height =585
                    FontSize =11
                    FontWeight =700
                    ForeColor =8388608
                    Name ="section_تسمية"
                    Caption ="القسم"
                    FontName ="Arial (Arabic)"
                    Tag ="DetachedLabel"
                End
                Begin Label
                    BackStyle =1
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    TextFontFamily =34
                    Left =6315
                    Top =1770
                    Width =771
                    Height =570
                    FontSize =11
                    FontWeight =700
                    ForeColor =8388608
                    Name ="sal_day_تسمية"
                    Caption ="اليومية"
                    FontName ="Arial (Arabic)"
                    Tag ="DetachedLabel"
                    LayoutCachedLeft =6315
                    LayoutCachedTop =1770
                    LayoutCachedWidth =7086
                    LayoutCachedHeight =2340
                End
                Begin Label
                    BackStyle =1
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    TextFontFamily =34
                    Left =5355
                    Top =1770
                    Width =966
                    Height =570
                    FontSize =11
                    FontWeight =700
                    ForeColor =8388608
                    Name ="DAYS_تسمية"
                    Caption ="الايام"
                    FontName ="Arial (Arabic)"
                    Tag ="DetachedLabel"
                    LayoutCachedLeft =5355
                    LayoutCachedTop =1770
                    LayoutCachedWidth =6321
                    LayoutCachedHeight =2340
                End
                Begin Label
                    BackStyle =1
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    TextFontFamily =34
                    Left =4545
                    Top =1770
                    Width =765
                    Height =570
                    FontSize =10
                    FontWeight =700
                    ForeColor =8388608
                    Name ="ADD_HOURS_تسمية"
                    Caption ="ساعات الاضافي"
                    FontName ="Arial (Arabic)"
                    Tag ="DetachedLabel"
                    LayoutCachedLeft =4545
                    LayoutCachedTop =1770
                    LayoutCachedWidth =5310
                    LayoutCachedHeight =2340
                End
                Begin Label
                    BackStyle =1
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    TextFontFamily =34
                    Left =3615
                    Top =1770
                    Width =885
                    Height =570
                    FontSize =10
                    FontWeight =700
                    ForeColor =8388608
                    Name ="تسمية45"
                    Caption ="قيمة الاضافي"
                    FontName ="Arial (Arabic)"
                    Tag ="DetachedLabel"
                    LayoutCachedLeft =3615
                    LayoutCachedTop =1770
                    LayoutCachedWidth =4500
                    LayoutCachedHeight =2340
                End
                Begin Rectangle
                    BackStyle =0
                    BorderWidth =2
                    Left =885
                    Top =1695
                    Width =6346
                    Height =2079
                    Name ="مربع/خانة4"
                    EventProcPrefix ="مربع_خانة4"
                    LayoutCachedLeft =885
                    LayoutCachedTop =1695
                    LayoutCachedWidth =7231
                    LayoutCachedHeight =3774
                End
                Begin Rectangle
                    BackStyle =0
                    BorderWidth =2
                    Left =900
                    Top =427
                    Width =6349
                    Height =1190
                    Name ="مربع/خانة5"
                    EventProcPrefix ="مربع_خانة5"
                End
                Begin Label
                    OldBorderStyle =1
                    TextAlign =2
                    TextFontFamily =34
                    Left =3075
                    Width =1935
                    Height =315
                    FontSize =11
                    FontWeight =700
                    BorderColor =4210752
                    Name ="تسمية7"
                    Caption ="قسيمة الراتب / الموظفين"
                    LayoutCachedLeft =3075
                    LayoutCachedWidth =5010
                    LayoutCachedHeight =315
                End
                Begin TextBox
                    SpecialEffect =4
                    OldBorderStyle =1
                    BorderWidth =3
                    TextAlign =2
                    IMESentenceMode =3
                    Left =1218
                    Top =47
                    Height =345
                    ColumnOrder =3
                    FontSize =12
                    FontWeight =700
                    TabIndex =7
                    BackColor =12632256
                    Name ="date no"
                    ControlSource ="date no"
                    EventProcPrefix ="date_no"

                End
                Begin TextBox
                    SpecialEffect =4
                    OldBorderStyle =1
                    BorderWidth =3
                    TextAlign =2
                    IMESentenceMode =3
                    Left =5685
                    Top =60
                    Height =300
                    ColumnWidth =2550
                    ColumnOrder =2
                    FontWeight =700
                    TabIndex =8
                    BorderColor =4210752
                    Name ="BANK NAME"
                    ControlSource ="اسم البنك"
                    StatusBarText ="اسم البنك"
                    EventProcPrefix ="BANK_NAME"

                End
                Begin TextBox
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    TextFontFamily =0
                    IMESentenceMode =3
                    Left =2721
                    Top =2929
                    Width =2295
                    Height =375
                    ColumnWidth =2235
                    ColumnOrder =1
                    FontSize =16
                    FontWeight =700
                    TabIndex =9
                    BackColor =16777164
                    Name ="EMP_TOTAL_SAL"
                    ControlSource ="EMP_TOTAL_SAL"
                    FontName ="Arial (Arabic)"

                    LayoutCachedLeft =2721
                    LayoutCachedTop =2929
                    LayoutCachedWidth =5016
                    LayoutCachedHeight =3304
                End
                Begin TextBox
                    OldBorderStyle =1
                    TextFontCharSet =177
                    TextAlign =2
                    IMESentenceMode =3
                    Left =2115
                    Top =2445
                    Width =900
                    Height =225
                    FontWeight =700
                    TabIndex =10
                    Name ="PROCEDURE"
                    ControlSource ="PROCEDURE"
                    StatusBarText ="مأمور اجراء"

                    LayoutCachedLeft =2115
                    LayoutCachedTop =2445
                    LayoutCachedWidth =3015
                    LayoutCachedHeight =2670
                End
                Begin TextBox
                    DecimalPlaces =3
                    OldBorderStyle =1
                    TextFontCharSet =177
                    TextAlign =2
                    IMESentenceMode =3
                    Left =1110
                    Top =2445
                    Width =885
                    Height =225
                    ColumnWidth =1860
                    FontWeight =700
                    TabIndex =11
                    Name ="SPONSORED"
                    ControlSource ="قيمة الاقتطاعات الاسبوعية"
                    StatusBarText ="الضمان"

                    LayoutCachedLeft =1110
                    LayoutCachedTop =2445
                    LayoutCachedWidth =1995
                    LayoutCachedHeight =2670
                End
                Begin Label
                    BackStyle =1
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    TextFontFamily =34
                    Left =2130
                    Top =2145
                    Width =885
                    Height =240
                    FontSize =10
                    FontWeight =700
                    ForeColor =8388608
                    Name ="تسمية3"
                    Caption ="اجراء/خصم"
                    FontName ="Arial (Arabic)"
                    Tag ="DetachedLabel"
                    LayoutCachedLeft =2130
                    LayoutCachedTop =2145
                    LayoutCachedWidth =3015
                    LayoutCachedHeight =2385
                End
                Begin Label
                    BackStyle =1
                    OldBorderStyle =1
                    BorderWidth =1
                    TextFontCharSet =178
                    TextAlign =2
                    TextFontFamily =0
                    Left =1110
                    Top =2145
                    Width =885
                    Height =225
                    FontSize =7
                    FontWeight =700
                    ForeColor =8388608
                    Name ="تسمية4"
                    Caption ="قيمة الاقتطاعات"
                    FontName ="Arial (Arabic)"
                    Tag ="DetachedLabel"
                    LayoutCachedLeft =1110
                    LayoutCachedTop =2145
                    LayoutCachedWidth =1995
                    LayoutCachedHeight =2370
                End
                Begin Subform
                    OldBorderStyle =0
                    Left =963
                    Top =486
                    Width =1335
                    Height =1065
                    TabIndex =12
                    Name ="شعار"
                    SourceObject ="Form.شعار"
                    GridlineColor =10921638

                    LayoutCachedLeft =963
                    LayoutCachedTop =486
                    LayoutCachedWidth =2298
                    LayoutCachedHeight =1551
                End
            End
        End
        Begin PageFooter
            Height =0
            Name ="PageFooterSection"
        End
    End
End
```


## Links

- [[queries/all-inq_1]]

## Referenciado por

- [[_critical-objects]]
