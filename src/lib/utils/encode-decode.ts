import { decodeBase64, encodeBase64 } from '@oslojs/encoding';

export const utf8ToBase64 = (utf8String: string) => {
  if (typeof utf8String !== 'string') return null;

  const data = new TextEncoder().encode(utf8String);
  const base64String = encodeBase64(data);
  return base64String;
};

export const base64ToUtf8 = (base64String: string | null) => {
  if (typeof base64String !== 'string') return null;

  let base64StringList = base64String.split('\n');
  base64StringList = base64StringList.map((stringInstance) => {
    const data = decodeBase64(stringInstance);
    const utf8StringInstance = new TextDecoder().decode(data);
    return utf8StringInstance;
  });

  const utf8String = base64StringList.join('');

  return utf8String;
};
