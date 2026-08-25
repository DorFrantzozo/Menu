// Single source of truth mapping a user's designNumber to its component and
// its capability config. Anything that needs to render a menu, or ask what a
// design supports, goes through here instead of a chain of === checks.
import Design1 from "./Design1/Design1";
import Design2 from "./Design2/Design2";
import Design3 from "./Design3/Design3";
import Design4 from "./Design4/Design4";
import Design5 from "./Design5/Design5";
import Design6 from "./Design6/Design6";

import {design1Config} from "./Design1/design1.config";
import {design2Config} from "./Design2/design2.config";
import {design3Config} from "./Design3/design3.config";
import {design4Config} from "./Design4/design4.config";
import {design5Config} from "./Design5/design5.config";
import {design6Config} from "./Design6/design6.config";

// Matches the `designNumber` default on the User model.
export const DEFAULT_DESIGN_NUMBER = 4;

export const DESIGNS = {
  1: {Component: Design1, config: design1Config},
  2: {Component: Design2, config: design2Config},
  3: {Component: Design3, config: design3Config},
  4: {Component: Design4, config: design4Config},
  5: {Component: Design5, config: design5Config},
  6: {Component: Design6, config: design6Config},
};

export const DESIGN_NUMBERS = Object.keys(DESIGNS).map(Number);

// Always resolves to a renderable design. An unknown or missing designNumber
// falls back to the default rather than rendering nothing.
export const getDesign = (designNumber) =>
  DESIGNS[designNumber] ?? DESIGNS[DEFAULT_DESIGN_NUMBER];

export const getDesignConfig = (designNumber) => getDesign(designNumber).config;

export const getDesignTheme = (designNumber) => getDesign(designNumber).config.theme;
