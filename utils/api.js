import AsyncStorage from '@react-native-async-storage/async-storage';
// The place where we are going to persist the information:
import { CALENDAR_STORAGE_KEY, formatCalendarResults } from './_calendar';

export function submitEntry({ key, entry }) {
  return AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({ [key]: entry }));
}

export function removeEntry({ key }) {
  return AsyncStorage.getItem(CALENDAR_STORAGE_KEY).then((results) => {
    const data = JSON.parse(results);
    data[key] = undefined;
    delete data[key];
    AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data));
  });
}

// Get data from storage and format results

export function fetchCalendarResults() {
  return AsyncStorage.getItem(CALENDAR_STORAGE_KEY).then(formatCalendarResults);
}
