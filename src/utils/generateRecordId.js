import { v4 as uuidv4 } from 'uuid';

export function generateRecordId() {
  return `skillup-${uuidv4()}`;
}