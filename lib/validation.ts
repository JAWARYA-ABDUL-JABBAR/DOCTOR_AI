export const MAX_IMAGE_BYTES=10*1024*1024;
export const IMAGE_TYPES=['image/png','image/jpeg'];
export function validProjectName(value:unknown){return typeof value==='string'&&value.trim().length>0&&value.trim().length<=100}
export function validEmail(value:unknown){return typeof value==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)&&value.length<=254}
export function validPassword(value:unknown){return typeof value==='string'&&value.length>=8&&value.length<=128}
