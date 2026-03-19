<<<<<<< HEAD

import { useState } from 'react';
import { copyToClipboard } from '../utils/mockData';

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    return success;
  };

  return { copied, copy };
=======

import { useState } from 'react';
import { copyToClipboard } from '../utils/mockData';

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    return success;
  };

  return { copied, copy };
>>>>>>> 4f0855fa2297a8c8d4f0b05a83e80303ea599fc6
};