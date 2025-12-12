import { atomWithStorage } from "jotai/utils";

export const showCalendarWidgetAtom = atomWithStorage<boolean>(
  "wfcos-ui-show-calendar-widget",
  false
);

export const showClockWidgetAtom = atomWithStorage<boolean>(
  "wfcos-ui-show-clock-widget",
  false
);



