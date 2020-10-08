import { formatDateStr } from "./utils/date_utils";
import { AddTaskItemObject } from "./task";
import { addListenerInputCell, addListenerClickCell } from "./events";
import { newNode, makeInput } from "./utils/draw_utils";


export const COLUMN_ORDER = [
  'vShowRes',
  'vShowDur',
  'vShowComp',
  'vShowStartDate',
  'vShowEndDate',
  'vShowPlanStartDate',
  'vShowPlanEndDate',
  'vShowCost',
  'vAdditionalHeaders',
  'vShowAddEntries'
];


export const draw_header = function (column, i, vTmpRow, vTaskList, vEditable, vEventsChange, vEvents,
  vDateTaskTableDisplayFormat, vAdditionalHeaders, vFormat, vLangs, vLang, vResources, Draw, absolute = null, pTop = null, pLeft = null) {
  let vTmpCell;

  if ('vShowRes' === column) {
    draw_normal_item(vTmpRow,'gresource',
                     vTaskList[i].getResource(),vEditable,'resource',vTaskList[i].getResource(),vResources, 
                     (task, e) => task.setResource(e.target.value),
                     vEventsChange, vEvents, vTaskList, i, 'res', Draw,'change', absolute, pTop, pLeft);
  }
  if ('vShowDur' === column) {
    draw_normal_item(vTmpRow,'gduration',
                     vTaskList[i].getDuration(vFormat, vLangs[vLang]),vEditable,'text',vTaskList[i].getDuration(),null,
                     (task, e) => task.setDuration(e.target.value),
                     vEventsChange, vEvents, vTaskList, i, 'dur', Draw, null, absolute, pTop, pLeft);
  }
  if ('vShowComp' === column) {
    draw_normal_item(vTmpRow,'gpccomplete',
                     vTaskList[i].getCompStr(),vEditable,'percentage',vTaskList[i].getCompVal(),null,
                     (task, e) => { task.setComp(e.target.value); task.setCompVal(e.target.value); },
                     vEventsChange, vEvents, vTaskList, i, 'comp', Draw, null, absolute, pTop, pLeft);
  }
  if ('vShowStartDate' === column) {
    const v = formatDateStr(vTaskList[i].getStartVar(), vDateTaskTableDisplayFormat, vLangs[vLang])
    draw_normal_item(vTmpRow,'gstartdate',
                     v,vEditable,'date',vTaskList[i].getStartVar(),null,
                     (task, e) => task.setStart(e.target.value),
                     vEventsChange, vEvents, vTaskList, i, 'start', Draw, null, absolute, pTop, pLeft);
  }
  if ('vShowEndDate' === column) {
    const v = formatDateStr(vTaskList[i].getEndVar(), vDateTaskTableDisplayFormat, vLangs[vLang]);
    draw_normal_item(vTmpRow,'genddate',
                     v,vEditable,'date',vTaskList[i].getEndVar(),null,
                     (task, e) => task.setEnd(e.target.value),
                     vEventsChange, vEvents, vTaskList, i, 'end', Draw, null, absolute, pTop, pLeft);
  }
  if ('vShowPlanStartDate' === column) {
    const v = vTaskList[i].getPlanStart() ? formatDateStr(vTaskList[i].getPlanStart(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
    draw_normal_item(vTmpRow,'gplanstartdate',
                     v,vEditable,'date',vTaskList[i].getPlanStart(),null,
                     (task, e) => task.setPlanStart(e.target.value),
                     vEventsChange, vEvents, vTaskList, i, 'planstart', Draw, null, absolute, pTop, pLeft);
  }
  if ('vShowPlanEndDate' === column) {
    const v = vTaskList[i].getPlanEnd() ? formatDateStr(vTaskList[i].getPlanEnd(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
    draw_normal_item(vTmpRow,'gplanenddate',
                     v,vEditable,'date',vTaskList[i].getPlanEnd(),null,
                     (task, e) => task.setPlanEnd(e.target.value),
                     vEventsChange, vEvents, vTaskList, i, 'planend', Draw, null, absolute, pTop, pLeft);
  }
  if ('vShowCost' === column) {
    draw_normal_item(vTmpRow,'gcost',
                     vTaskList[i].getCost(),vEditable,'cost',null,null,
                     (task, e) => task.setCost(e.target.value),
                     vEventsChange, vEvents, vTaskList, i, 'cost', Draw, null, absolute, pTop, pLeft);
  }


  if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
    for (const key in vAdditionalHeaders) {
      const header = vAdditionalHeaders[key];
      const css = header.class ? header.class : `gadditional-${key}`;
      const data = vTaskList[i].getDataObject();
      vTmpCell = newNode(vTmpRow, 'div', null, `gadditional ${css}`, null, null, null, 'inline-block');
      // const callback = (task, e) => task.setCost(e.target.value);
      // addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'costdate');
      newNode(vTmpCell, 'div', null, null, data ? data[key] : '');
    }
  }

  if ('vShowAddEntries' === column) {
    vTmpCell = newNode(vTmpRow, 'div', null, 'gaddentries',null, null, null, 'inline-block');
    const button = "<button>+</button>";
    newNode(vTmpCell, 'div', null, null, button);

    const callback = (task, e) => {
      AddTaskItemObject({
        vParent: task.getParent()
      });
    }
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'addentries', Draw.bind(this));
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'addentries');
  }
};

const draw_normal_item = function (vTmpRow, pID, dataFormat, vEditable, dataType, data2show, choices, callback,
  vEventsChange, vEvents, vTaskList, i, column, draw = null, event = null, absolute = null, pTop = null, pLeft = null) {
  let vTmpCell = newNode(vTmpRow, 'div', null, pID,null,null,pLeft,'inline-block',null,null,absolute, pTop);
  const text = makeInput(dataFormat, vEditable, dataType, data2show, choices);
  newNode(vTmpCell, 'div', null, null, text);
  addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, column, draw, event);
  addListenerClickCell(vTmpCell, vEvents, vTaskList[i], column);
  return vTmpCell;
}

export const draw_bottom = function (column, vTmpRow, vAdditionalHeaders) {
  if ('vShowRes' === column) newNode(vTmpRow, 'div', null, 'gspanning gresource', '\u00A0', null, null,'inline-block');
  if ('vShowDur' === column) newNode(vTmpRow, 'div', null, 'gspanning gduration', '\u00A0', null, null,'inline-block');
  if ('vShowComp' === column) newNode(vTmpRow, 'div', null, 'gspanning gpccomplete', '\u00A0', null, null,'inline-block');
  if ('vShowStartDate' === column) newNode(vTmpRow, 'div', null, 'gspanning gstartdate', '\u00A0', null, null,'inline-block');
  if ('vShowEndDate' === column) newNode(vTmpRow, 'div', null, 'gspanning genddate', '\u00A0', null, null,'inline-block');
  if ('vShowPlanStartDate' === column) newNode(vTmpRow, 'div', null, 'gspanning gplanstartdate', '\u00A0', null, null,'inline-block');
  if ('vShowPlanEndDate' === column) newNode(vTmpRow, 'div', null, 'gspanning gplanenddate', '\u00A0', null, null,'inline-block');
  if ('vShowCost' === column) newNode(vTmpRow, 'div', null, 'gspanning gcost', '\u00A0', null, null,'inline-block');

  if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
    for (const key in vAdditionalHeaders) {
      const header = vAdditionalHeaders[key];
      const css = header.class ? header.class : `gadditional-${key}`;
      newNode(vTmpRow, 'div', null, `gspanning gadditional ${css}`, '\u00A0', null, null,'inline-block');
    }
  }

  if ('vShowAddEntries' === column) newNode(vTmpRow, 'div', null, 'gspanning gaddentries', '\u00A0', null, null,'inline-block');
}

export const draw_list_headings = function (column, vTmpRow, vAdditionalHeaders) {

  if ('vShowRes' === column) newNode(vTmpRow, 'td', null, 'gspanning gresource', '\u00A0');
  if ('vShowDur' === column) newNode(vTmpRow, 'td', null, 'gspanning gduration', '\u00A0');
  if ('vShowComp' === column) newNode(vTmpRow, 'td', null, 'gspanning gpccomplete', '\u00A0');
  if ('vShowStartDate' === column) newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
  if ('vShowEndDate' === column) newNode(vTmpRow, 'td', null, 'gspanning genddate', '\u00A0');
  if ('vShowPlanStartDate' === column) newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
  if ('vShowPlanEndDate' === column) newNode(vTmpRow, 'td', null, 'gspanning gplanenddate', '\u00A0');
  if ('vShowCost' === column) newNode(vTmpRow, 'td', null, 'gspanning gcost', '\u00A0');
  if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
    for (const key in vAdditionalHeaders) {
      const header = vAdditionalHeaders[key];
      const css = header.class ? header.class : `gadditional-${key}`;
      newNode(vTmpRow, 'td', null, `gspanning gadditional ${css}`, '\u00A0');
    }
  }
  if ('vShowAddEntries' === column) newNode(vTmpRow, 'td', null, 'gspanning gaddentries', '\u00A0');
}

export const draw_task_headings = function (column, vTmpRow, vLangs, vLang, vAdditionalHeaders) {

  if ('vShowRes' === column) newNode(vTmpRow, 'td', null, 'gtaskheading gresource', vLangs[vLang]['resource']);
  if ('vShowDur' === column) newNode(vTmpRow, 'td', null, 'gtaskheading gduration', vLangs[vLang]['duration']);
  if ('vShowComp' === column) newNode(vTmpRow, 'td', null, 'gtaskheading gpccomplete', vLangs[vLang]['comp']);
  if ('vShowStartDate' === column) newNode(vTmpRow, 'td', null, 'gtaskheading gstartdate', vLangs[vLang]['startdate']);
  if ('vShowEndDate' === column) newNode(vTmpRow, 'td', null, 'gtaskheading genddate', vLangs[vLang]['enddate']);
  if ('vShowPlanStartDate' === column) newNode(vTmpRow, 'td', null, 'gtaskheading gplanstartdate', vLangs[vLang]['planstartdate']);
  if ('vShowPlanEndDate' === column) newNode(vTmpRow, 'td', null, 'gtaskheading gplanenddate', vLangs[vLang]['planenddate']);
  if ('vShowCost' === column) newNode(vTmpRow, 'td', null, 'gtaskheading gcost', vLangs[vLang]['cost']);
  if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
    for (const key in vAdditionalHeaders) {
      const header = vAdditionalHeaders[key];
      const text = header.translate ? vLangs[vLang][header.translate] : header.title;
      const css = header.class ? header.class : `gadditional-${key}`;
      newNode(vTmpRow, 'td', null, `gtaskheading gadditional ${css}`, text);
    }
  }
  if ('vShowAddEntries' === column) newNode(vTmpRow, 'td', null, 'gtaskheading gaddentries', vLangs[vLang]['addentries']);
}
