export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());


export const isPhone = (value: string) => /^[0-9()+\-\s]{7,15}$/.test(value.trim());

export const hasMinLen = (value: string, min: number) => value.trim().length >= min;

export const isPositiveNumber = (value: string | number) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
};

export const isNumberAtLeast = (value: string | number, min: number) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= min;
};
