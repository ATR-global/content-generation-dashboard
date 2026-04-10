export interface ManualRecord {
  id: number;
  wpPageId: number;
  pageUrl: string;
  wpPostUrl: string;
  score: number;
  status: string;
  title: string;
  previewThumbnails: string[];
  metaFormat: string;
  metaPages: number;
  metaLanguage: string;
  metaApplianceType: string;
  documentOverview: string;
  sourceIntegrity: string;
  quickTroubleshootingGuide: string[];
  technicalSpecs: string[];
  compatibleModels: string[];
  whatThisManualHelpsYouFix: string[];
  whatsInsideThisManual: string[];
  troubleshootingGuideQuestions: string[];
  troubleshootingGuideAnswers: string[];
  contentIssuesRecommendations: string;
}

export const sampleManuals: ManualRecord[] = [
  {
    id: 14,
    wpPageId: 25497,
    pageUrl: 'https://stagingnew.allusermanuals.com/appliances/range/ge/jbs86spss/',
    wpPostUrl:
      'https://stagingnew.allusermanuals.com/wp-admin/post.php?post=25497&action=edit',
    score: 8.89,
    status: 'done',
    title: 'GE Range JBS86SPSS Owner\'s Manual & Troubleshooting Guide',
    previewThumbnails: [
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-jbs86spss-product-manual-preview-1.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-jbs86spss-product-manual-preview-2.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-jbs86spss-product-manual-preview-3.png',
    ],
    metaFormat: 'PDF',
    metaPages: 64,
    metaLanguage: 'English, Español',
    metaApplianceType: 'Range',
    documentOverview:
      'This manual contains the full manufacturer approved diagnostic reference for GE JBS86SPSS Range. It provides comprehensive technical guidance for Radiant Glass Cooktop, Double Oven Controls, and structured troubleshooting for performance-related conditions.',
    sourceIntegrity:
      'This documentation is sourced from original manufacturer archives to ensure the highest level of accuracy and reliability for appliance maintenance and operation.',
    quickTroubleshootingGuide: [
      'Why is the display blank? (Power supply or Sabbath Mode setting): #display-blank',
      'Why won\'t the oven self-clean? (Oven temperature or door lock issue): #self-clean-failure',
      'Why are surface units not boiling? (Cookware type or power supply issue): #boiling-issues',
      'What does an F error code mean? (Verbatim function error code identification): #error-codes',
    ],
    technicalSpecs: [
      'Bulb Type: 120/130-volt halogen bulb (not to exceed 50 watts)',
      'Bulb Type: 40-watt appliance bulb',
      'Dimensions: 30" width',
      'Temperature Threshold: 150°F for Hot Cooktop indicator',
      'Temperature Threshold: 140°F for Warming Zone',
    ],
    compatibleModels: ['JB860', 'PB960', 'PB980', 'JBS86', '30" Free-Standing Double Oven'],
    whatThisManualHelpsYouFix: [
      'Surface units will not maintain a rolling boil or cooking is not fast enough',
      'Surface unit stops glowing when turned to a lower setting',
      'F— and a number or letter flash in the display',
      'Oven door will not open after a clean cycle',
    ],
    whatsInsideThisManual: [
      'Important Safety Information',
      'Using the Range',
      'Care and Cleaning',
      'Troubleshooting Tips',
      'Limited Warranty',
    ],
    troubleshootingGuideQuestions: [
      'Why is the display blank?',
      'Why won\'t the oven self-clean?',
      'Why are surface units not boiling?',
      'What does an F error code mean?',
    ],
    troubleshootingGuideAnswers: [
      'A dark screen often indicates a disruption in the electrical supply or a specific active mode. This state can occur when a household breaker trips or if the Sabbath Mode has been enabled by the user. Confirm that the range is fully plugged into a live outlet. Consult the manufacturer documentation for the specific configuration details required to restore the interface.',
      'The self-cleaning function may fail to initiate if the internal temperature is currently too high for the cycle. This safety feature prevents the process from starting until the cavity reaches a safe starting point. Verify that the oven door is completely closed and the latch is not obstructed. Refer to the official guidance for the necessary steps to reset the cleaning controls.',
      'Slow heating or an inability to maintain a boil usually stems from the type of pots being utilized. Using pans that are not flat or do not match the element diameter can result in poor heat transfer. Check that your cookware has a perfectly flat bottom using a straight edge. The diagnostic reference provides further information on selecting compatible materials for your range.',
      'Seeing a letter followed by a number like F2 in the display signifies that the system has detected a specific operational condition. These codes appear to alert the user that the appliance requires a reset or a cooling period. Try disconnecting the power at the circuit breaker for several minutes to see if the code clears. Detailed descriptions of these signals are located within the official guidance.',
    ],
    contentIssuesRecommendations: '',
  },
  {
    id: 15,
    wpPageId: 28359,
    pageUrl: 'https://stagingnew.allusermanuals.com/appliances/range/ge/jgb735sp1ss/',
    wpPostUrl:
      'https://stagingnew.allusermanuals.com/wp-admin/post.php?post=28359&action=edit',
    score: 8.89,
    status: 'for_review',
    title: 'GE Range JGB735SP1SS Owner\'s Manual & Troubleshooting Guide',
    previewThumbnails: [
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-jgb735sp1ss-product-manual-preview-1.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-jgb735sp1ss-product-manual-preview-2.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-jgb735sp1ss-product-manual-preview-3.png',
    ],
    metaFormat: 'PDF',
    metaPages: 70,
    metaLanguage: 'English, Español',
    metaApplianceType: 'Range',
    documentOverview:
      'This manual contains the full manufacturer approved diagnostic reference for GE JGB735SP1SS Range. It provides comprehensive technical guidance for Surface Burners, Oven Controls, and structured troubleshooting for performance-related conditions.',
    sourceIntegrity:
      'This documentation is sourced from original manufacturer archives to ensure the highest level of accuracy and reliability for appliance maintenance and operation.',
    quickTroubleshootingGuide: [
      'Why is the oven display not working? (Power supply or breaker issue): #oven-display-not-working',
      'What does a flashing F error code mean? (Function error code on display): #flashing-f-error-code',
      'Why won\'t the oven start self-cleaning? (High internal temperature or setting error): #oven-wont-self-clean',
      'Why are the surface burners not lighting? (Gas supply or electrical connection problem): #burners-not-lighting',
    ],
    technicalSpecs: [
      'Voltage: 120-volt',
      'Bulb Wattage: 40-watt',
      'Maximum Wok Diameter: 14 inches',
      'Power Boil Cookware Diameter: 11 inches or larger',
    ],
    compatibleModels: ['JGB660', 'JGB735', 'PGB935', 'PGB355', 'Self-Cleaning Gas Ranges'],
    whatThisManualHelpsYouFix: [
      'Oven and/or display appears not to work',
      'Burners do not light',
      'Oven will not self-clean',
      'Top burners do not burn evenly',
    ],
    whatsInsideThisManual: [
      'Safety Information',
      'Using the Range',
      'Care and Cleaning',
      'Troubleshooting Tips',
      'Limited Warranty',
    ],
    troubleshootingGuideQuestions: [
      'Why is the oven display not working?',
      'What does a flashing F error code mean?',
      'Why won\'t the oven start self-cleaning?',
      'Why are the surface burners not lighting?',
    ],
    troubleshootingGuideAnswers: [
      'It is frustrating when the oven interface remains dark or unresponsive during use. This situation often stems from a tripped household circuit breaker or a disconnected power cord. Confirm that the range is firmly plugged into a grounded outlet. Consult the manufacturer documentation for specific power configuration details.',
      'Seeing a flashing F followed by numbers or letters indicates the system has encountered an operational hurdle. These sequences represent a function error code triggered by specific internal conditions. Try clearing the display by selecting the cancel option to see if the code persists. Refer to the official guidance for a complete list of code definitions.',
      'The self-cleaning cycle may fail to initiate when the oven is prompted to start. This can occur when the internal heat is too high from recent cooking to allow the cycle to begin. Allow the unit to cool down completely before attempting to engage the cleaning feature again. The diagnostic reference provides further instructions on proper cycle setup.',
      'Surface burners might fail to produce a flame even when the control knobs are turned. A lack of ignition often relates to an interrupted gas supply or misaligned burner components. Verify that the gas shut-off valve is in the open position. Detailed assembly steps are located within the manufacturer documentation.',
    ],
    contentIssuesRecommendations: '',
  },
  {
    id: 16,
    wpPageId: 28429,
    pageUrl: 'https://stagingnew.allusermanuals.com/appliances/range/ge/pb965yp5fs/',
    wpPostUrl:
      'https://stagingnew.allusermanuals.com/wp-admin/post.php?post=28429&action=edit',
    score: 8.9,
    status: 'for_review',
    title: 'GE Range PB965YP5FS Owner\'s Manual & Troubleshooting Guide',
    previewThumbnails: [
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-pb965yp5fs-product-manual-preview-1.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-pb965yp5fs-product-manual-preview-2.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-pb965yp5fs-product-manual-preview-3.png',
    ],
    metaFormat: 'PDF',
    metaPages: 64,
    metaLanguage: 'English, Français',
    metaApplianceType: 'Range',
    documentOverview:
      'This manual contains the full manufacturer approved diagnostic reference for GE PB965YP5FS Range. It provides comprehensive technical guidance for Surface Units, Oven Controls, and structured troubleshooting for performance-related conditions.',
    sourceIntegrity:
      'This documentation is sourced from original manufacturer archives to ensure the highest level of accuracy and reliability for appliance maintenance and operation.',
    quickTroubleshootingGuide: [
      'Why are F-codes flashing on the display? (Function error or component issue): #f-code-flashing',
      'Why is the oven light failing to turn on? (Loose bulb or power supply issue): #oven-light-failure',
      'Why won\'t the cooktop maintain a rolling boil? (Improper cookware or low voltage): #boil-maintenance-issue',
      'Why has the control display gone blank? (Power loss or Sabbath Mode active): #blank-display-issue',
    ],
    technicalSpecs: [
      'Range Width: 30"',
      'Oven Light Bulb: 40-watt household appliance bulb',
      'Hot Cooktop Indicator Threshold: 150°F',
      'Minimum Internal Meat Temperature: 160°F',
      'Minimum Internal Poultry Temperature: 180°F',
      'Warming Zone Minimum Temperature: 140°F',
    ],
    compatibleModels: ['30" Free-Standing Range', 'PB935', 'JB735'],
    whatThisManualHelpsYouFix: [
      'Surface units will not maintain a rolling boil or cooking is not fast enough',
      'Scratches appear as cracks on cooktop glass surface',
      'Oven door is crooked',
      'F— and a number or letter flash in the display',
    ],
    whatsInsideThisManual: [
      'Safety Information',
      'Using the Range',
      'Care and Cleaning',
      'Troubleshooting Tips',
      'Limited Warranty',
    ],
    troubleshootingGuideQuestions: [
      'Why are F-codes flashing on the display?',
      'Why is the oven light failing to turn on?',
      'Why won\'t the cooktop maintain a rolling boil?',
      'Why has the control display gone blank?',
    ],
    troubleshootingGuideAnswers: [
      'A flashing F followed by numbers or letters indicates the range has detected a specific function error. This state often occurs when the system requires a reset to clear a temporary glitch. Confirm whether the code clears after an hour of inactivity. Detailed resolution sequences are located within the manufacturer documentation.',
      'If the interior illumination fails, the bulb might be loose in its socket or simply reached the end of its life. This situation can also stem from a lack of electrical power reaching the unit. Confirm that the glass cover is secure and the bulb is tightened properly. Specific replacement instructions are provided in the official guidance.',
      'Difficulty reaching or keeping a boil often happens when the pans used do not match the size of the heating element. Heat transfer is less efficient if the cookware bottom is not perfectly flat against the glass. Verify that your pots are the correct diameter for the selected surface unit. Consult the configuration details in the manual for proper cookware selection.',
      'An unlit display panel can occur when the range is accidentally placed into Sabbath Mode. This condition might also be caused by a tripped house circuit breaker or a blown fuse. Check your home electrical panel to ensure the range is receiving power. The diagnostic reference contains the necessary steps to exit specialized display modes.',
    ],
    contentIssuesRecommendations: '',
  },
  {
    id: 17,
    wpPageId: 28495,
    pageUrl: 'https://stagingnew.allusermanuals.com/appliances/range/ge/pb900yv2fs/',
    wpPostUrl:
      'https://stagingnew.allusermanuals.com/wp-admin/post.php?post=28495&action=edit',
    score: 8.4,
    status: 'content_ready',
    title: 'GE Range pb900yv2fs Owner\'s Manual & Troubleshooting Guide',
    previewThumbnails: [
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-pb900yv2fs-product-manual-preview-1.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-pb900yv2fs-product-manual-preview-2.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-pb900yv2fs-product-manual-preview-3.png',
    ],
    metaFormat: 'PDF',
    metaPages: 60,
    metaLanguage: 'English, Español',
    metaApplianceType: 'Range',
    documentOverview:
      'This manual contains the full manufacturer approved diagnostic reference for GE pb900yv2fs Range. It provides comprehensive technical guidance for Surface Units, Oven Controls, and structured troubleshooting for performance-related conditions.',
    sourceIntegrity:
      'This documentation is sourced from original manufacturer archives to ensure the highest level of accuracy and reliability for appliance maintenance and operation.',
    quickTroubleshootingGuide: [
      'Why is "F— and a number or letter" flashing? (Indicates a specific function error code): #error-code-flashing',
      'Why does the oven appear non-functional? (Sabbath Mode or power supply issue): #oven-not-working',
      'Why is the power setting flashing? (Incorrect pan placement or flat bottom): #surface-unit-flashing',
      'Why is the range display blank? (Clock setting or circuit breaker tripped): #blank-display',
    ],
    technicalSpecs: [
      'Bulb Type: 40-watt appliance bulb',
      'Small Broiler Pan Dimensions: 8 3/4" x 1 1/4" x 13 1/2"',
      'Large Broiler Pan Dimensions: 12 3/4" x 1 1/4" x 16 1/2"',
      'XL Broiler Pan Dimensions: 17" x 1 1/4" x 19 1/4"',
      'Air Fry Temperature Range: 300°F to 500°F',
    ],
    compatibleModels: ['PB900', 'Radiant Range'],
    whatThisManualHelpsYouFix: [
      'Surface units do not work properly or flashing power setting',
      'Oven does not work or appears not to work',
      'Excessive smoking during clean cycle',
      'F— and a number or letter flash in the display',
    ],
    whatsInsideThisManual: [
      'Safety Information',
      'Using the Range',
      'Care and Cleaning',
      'Troubleshooting Tips',
      'Limited Warranty',
    ],
    troubleshootingGuideQuestions: [
      'Why is "F— and a number or letter" flashing?',
      'Why does the oven appear non-functional?',
      'Why is the power setting flashing?',
      'Why is the range display blank?',
    ],
    troubleshootingGuideAnswers: [
      'You may notice a letter and number combination blinking on your range display. This state stems from a detected function error within the appliance. Confirm if the display resets after allowing the unit to cool for one hour. The manufacturer documentation provides the necessary configuration details for resolving these specific codes.',
      'The oven might fail to respond to commands or heat as expected. This condition can occur when the Sabbath Mode is active or if the power connection is interrupted. Verify that the electrical plug is fully seated in a live outlet. Consult the official guidance for the exact steps to adjust these settings.',
      'A flashing power indicator often signals that a surface unit is not operating correctly. This behavior usually relates to the positioning or the physical characteristics of your cookware. Ensure the pan is perfectly flat and centered within the cooking zone. Refer to the diagnostic reference for further information on surface unit operation.',
      'A completely dark control panel prevents you from seeing the time or settings. The issue may be due to a tripped household breaker or the clock feature being disabled. Check your home electrical panel to see if a fuse has blown. Specific instructions for restoring the display are located in the manufacturer documentation.',
    ],
    contentIssuesRecommendations: '',
  },
  {
    id: 18,
    wpPageId: 28521,
    pageUrl: 'https://stagingnew.allusermanuals.com/appliances/range/ge/ggf600avww/',
    wpPostUrl:
      'https://stagingnew.allusermanuals.com/wp-admin/post.php?post=28521&action=edit',
    score: 8.93,
    status: 'content_ready',
    title: 'GE Range GGF600AVWW Owner\'s Manual & Troubleshooting Guide',
    previewThumbnails: [
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-ggf600avww-product-manual-preview-1.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-ggf600avww-product-manual-preview-2.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-ggf600avww-product-manual-preview-3.png',
    ],
    metaFormat: 'PDF',
    metaPages: 72,
    metaLanguage: 'English, Español',
    metaApplianceType: 'Range',
    documentOverview:
      'This manual contains the full manufacturer approved diagnostic reference for GE GGF600AVWW Range. It provides comprehensive technical guidance for Gas Cooktop, Oven Controls, and structured troubleshooting for performance-related conditions.',
    sourceIntegrity:
      'This documentation is sourced from original manufacturer archives to ensure the highest level of accuracy and reliability for appliance maintenance and operation.',
    quickTroubleshootingGuide: [
      'Why is the display blank? (Power connection or circuit breaker issue): #blank-display',
      'Why does the control not respond? (Control lock or Sabbath mode active): #control-not-responding',
      'What does an F error code mean? (Internal function error code detected): #f-error-code',
      'Why are the burner flames orange? (High humidity or air quality factors): #orange-burner-flames',
    ],
    technicalSpecs: [
      'Oven Light Bulb Type: 120/130-volt halogen bulb',
      'Oven Light Bulb Base: G9',
      'Oven Light Bulb Maximum Wattage: 50 watts',
      'Air Fry Temperature Range: 300°F to 500°F',
      'Maximum Wok Diameter: 14 inches',
      'Oven Temperature Adjustment Range: +/- 35°F',
    ],
    compatibleModels: ['600 Series'],
    whatThisManualHelpsYouFix: [
      'Food does not cook properly',
      'Cakes are lopsided or uneven',
      'Oven control does not respond',
      'Strong odor from the insulation around the inside of the oven',
    ],
    whatsInsideThisManual: [
      'Safety Information',
      'Using Your Appliance',
      'Care and Cleaning',
      'Troubleshooting Tips',
      'Limited Warranty',
    ],
    troubleshootingGuideQuestions: [
      'Why is the display blank?',
      'Why does the control not respond?',
      'What does an F error code mean?',
      'Why are the burner flames orange?',
    ],
    troubleshootingGuideAnswers: [
      'A dark screen often indicates that the unit is not receiving electrical power. This situation may stem from a tripped household breaker or a disconnected plug. Confirm whether the power cord is fully seated in a grounded outlet. The manufacturer documentation provides the necessary configuration details for restoring electrical service.',
      'If the interface fails to react to touch, the control lock feature might be engaged. This state can occur when the Loc code is visible on the digital readout. Verify that the lock feature is active before attempting to start a cycle. Consult the official guidance for the specific steps to manage these interface settings.',
      'Seeing a letter followed by numbers on your screen signifies that a function error code has been triggered. These codes typically appear when the system detects an operational irregularity. Check if the display clears after a brief power reset. The diagnostic reference in the manual contains the full list of these specific codes.',
      'Orange-tinted flames on your cooktop burners are frequently caused by environmental factors like high humidity. This visual change is usually temporary and does not necessarily indicate a problem with the gas supply. Observe whether the use of a dehumidifier in the room alters the flame color. Refer to the manufacturer documentation for further details regarding burner performance.',
    ],
    contentIssuesRecommendations: '',
  },
  {
    id: 19,
    wpPageId: 28583,
    pageUrl: 'https://stagingnew.allusermanuals.com/appliances/range/ge/pgb911sej6ss/',
    wpPostUrl:
      'https://stagingnew.allusermanuals.com/wp-admin/post.php?post=28583&action=edit',
    score: 8.9,
    status: 'content_ready',
    title: 'GE Range PGB911SEJ6SS Owner\'s Manual & Troubleshooting Guide',
    previewThumbnails: [
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-pgb911sej6ss-product-manual-preview-1.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-pgb911sej6ss-product-manual-preview-2.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-pgb911sej6ss-product-manual-preview-3.png',
    ],
    metaFormat: 'PDF',
    metaPages: 72,
    metaLanguage: 'English, Español',
    metaApplianceType: 'Range',
    documentOverview:
      'This manual contains the full manufacturer approved diagnostic reference for GE PGB911SEJ6SS Range. It provides comprehensive technical guidance for Surface Burners, Oven Controls, and structured troubleshooting for performance-related conditions.',
    sourceIntegrity:
      'This documentation is sourced from original manufacturer archives to ensure the highest level of accuracy and reliability for appliance maintenance and operation.',
    quickTroubleshootingGuide: [
      'What do the F error codes mean? (Function error code or power issue): #error-codes',
      'Why is the control panel locked? (Control lockout feature is active): #control-lockout',
      'Why are the burners not lighting? (Power connection or gas supply issues): #burners-not-lighting',
      'Why won\'t the self-clean start? (High temperature or incorrect control settings): #self-clean-failure',
    ],
    technicalSpecs: [
      'Electrical Requirement: 120-volt grounded outlet',
      'Oven Light Bulb: 40-watt appliance bulb',
      'Oven Light Bulb Maximum Length: 3 1/2"',
      'Maximum Wok Diameter: 14 inches',
      'Power Boil Cookware Diameter: 11 inches or larger',
    ],
    compatibleModels: ['PGB911', 'PGB930', 'PGB940', 'JGS760'],
    whatThisManualHelpsYouFix: [
      'Food does not bake properly',
      'Oven and/or display appears not to work',
      'Burners do not light',
      'Oven door will not open or LOCKED light is on when you want to cook',
    ],
    whatsInsideThisManual: [
      'Safety Information',
      'Using the Range',
      'Care and Cleaning',
      'Troubleshooting Tips',
      'Limited Warranty',
    ],
    troubleshootingGuideQuestions: [
      'What do the F error codes mean?',
      'Why is the control panel locked?',
      'Why are the burners not lighting?',
      'Why won\'t the self-clean start?',
    ],
    troubleshootingGuideAnswers: [
      'An alphanumeric sequence appearing on the screen indicates a specific function error. This state often stems from a temporary power disruption or a detected operational conflict. You should confirm if the display resets after a brief power disconnection. The manufacturer documentation provides the necessary details for resolving these specific codes.',
      'The range interface may become unresponsive when the safety lock is engaged. This condition can occur when the "Loc" or "LOC ON" message is visible on the display. Confirm whether the lock feature was accidentally triggered during cleaning or use. Consult the official guidance for the exact steps to restore normal operation.',
      'Surface units failing to ignite is a common concern that often relates to the utility supply. This issue may be due to a disconnected power cord or a closed gas shut-off valve. Ensure that the range is securely plugged into a live electrical outlet. Detailed diagnostic reference material is available in the manual to assist with further troubleshooting.',
      'The self-cleaning cycle might fail to initiate if the internal temperature is currently too high. This safety restriction typically happens when the unit has not cooled sufficiently. Check that the oven door is completely closed and the controls are set according to the required parameters. Refer to the configuration details for the specific sequence needed to activate this feature.',
    ],
    contentIssuesRecommendations: '',
  },
  {
    id: 11,
    wpPageId: 25491,
    pageUrl: 'https://stagingnew.allusermanuals.com/appliances/range/ge/jb860sjss/',
    wpPostUrl:
      'https://stagingnew.allusermanuals.com/wp-admin/post.php?post=25491&action=edit',
    score: 7.6,
    status: 'content_error',
    title: 'GE Range JB860SJSS Owner\'s Manual & Troubleshooting Guide',
    previewThumbnails: [
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-jb860sjss-product-manual-preview-1.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-jb860sjss-product-manual-preview-2.png',
      'https://nyc3.digitaloceanspaces.com/allusermanuals/img/ge-range-jb860sjss-product-manual-preview-3.png',
    ],
    metaFormat: 'PDF',
    metaPages: 64,
    metaLanguage: 'English, Español',
    metaApplianceType: 'Electric Free-Standing Range',
    documentOverview:
      'This manual contains the full manufacturer approved diagnostic reference for GE JB860SJSS Range. It provides comprehensive technical guidance for Radiant Glass Cooktop, Double Oven Controls, and structured troubleshooting for performance-related conditions.',
    sourceIntegrity:
      'This documentation is sourced from original manufacturer archives to ensure the highest level of accuracy and reliability for appliance maintenance and operation.',
    quickTroubleshootingGuide: [
      'Why is the display blank? (Power supply or Sabbath Mode): #display-blank',
      'Why won\'t surface units maintain a boil? (Improper cookware or low voltage): #surface-boil-issue',
      'Why is the door lock light on? (High temperature or cooling phase): #door-lock-active',
      'What does an F2 error code mean? (Function error or system fault): #function-error-code',
    ],
    technicalSpecs: [
      'Bulb Type: G9 Bulb',
      'Bulb Wattage: 50 Watts',
      'Appliance Bulb Wattage: 40 Watts',
      'Voltage Rating: 120 Volts or 130 Volts',
      'Width: 30"',
      'Oven Temperature Adjustment: 35°F',
      'Warming Zone Minimum Temperature: 140°F',
      'Hot Cooktop Indicator Activation: 150°F',
    ],
    compatibleModels: ['JB860', 'PB960', 'PB980', 'JBS86', '30" Free-Standing Double Oven'],
    whatThisManualHelpsYouFix: [
      'Surface units will not maintain a rolling boil or cooking is not fast enough',
      'Scratches (may appear as cracks) on cooktop glass surface',
      '"F— and a number or letter" flash in the display',
      'Oven door will not open after a clean cycle',
    ],
    whatsInsideThisManual: [
      'Safety Information',
      'Using the Range',
      'Care and Cleaning',
      'Troubleshooting Tips',
      'Limited Warranty',
    ],
    troubleshootingGuideQuestions: [
      'Why is the display blank?',
      'Why won\'t surface units maintain a boil?',
      'Why is the door lock light on?',
      'What does an F2 error code mean?',
    ],
    troubleshootingGuideAnswers: [
      'A blank display screen might indicate a loss of power or a specific setting activation. This state often stems from a tripped circuit breaker or the engagement of the Sabbath Mode feature. You should confirm whether the household power supply is active and the clock is not simply turned off. The manufacturer documentation provides the configuration details for restoring the screen.',
      'If your cooktop elements fail to keep a rolling boil, the issue may be related to the pots being used. This condition can occur when cookware lacks a flat bottom or when the local power supply is insufficient. Verify that your pans are flat and match the diameter of the selected heating element. Consult the official guidance for specific cookware requirements and power recommendations.',
      'Seeing the control lock engaged icon usually means the interior is currently too hot for the door to open. This safety state typically follows a cleaning cycle or high-heat operation while the unit cools down. Check if the oven has had enough time to reach a safe temperature before attempting to open it. The diagnostic reference in the manual contains the necessary steps to manage the locking mechanism.',
      'When a code like F2 or another letter-number combination flashes, the appliance has detected a function error. These codes often appear when the system requires a reset or a cooling period. Try disconnecting the power for at least thirty seconds to see if the display clears upon restart. Refer to the official manual for the complete list of code definitions and resolution sequences.',
    ],
    contentIssuesRecommendations:
      'Issues:\n- Level 3 Resolution Leakage: The \'function-error-code\' section provides a full physical fix (30-second power disconnect), which resolves the search intent and removes the incentive to acquire the manual.\n- Level 2 Resolution Leakage: The \'surface-boil-issue\' section provides a physical fix regarding cookware flatness and diameter matching, reducing the information gap.\n\nRecommendation:\n- Gate the 30-second reset sequence by replacing the specific instruction with a reference to \'proprietary resolution sequences\' found in the technical manual.\n- Abstract the cookware requirements in the \'surface-boil-issue\' section to focus on the \'why\' (thermal transfer efficiency) while referencing the manual for \'approved cookware specifications\'.',
  },
];

export const allStatuses = [
  'pending',
  'processing',
  'content_ready',
  'content_error',
  'for_review',
  'done',
  'failed',
  'error',
  'incorrect_manual',
] as const;

export type ManualStatus = (typeof allStatuses)[number];

export const statusLabels: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  content_ready: 'Content Ready',
  content_error: 'Content Error',
  for_review: 'For Review',
  done: 'Done',
  failed: 'Failed',
  error: 'Error',
  incorrect_manual: 'Incorrect Manual',
};

export const pieChartData = {
  labels: [
    'Pending',
    'Processing',
    'Content Ready',
    'Content Error',
    'Done',
    'Failed',
    'Error',
    'Incorrect Manual',
  ],
  values: [187, 42, 284, 53, 612, 31, 18, 112],
};
