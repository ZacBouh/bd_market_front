export default function objectToFormData(
  data: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey?: string
): FormData {
  if (data === null || data === undefined) return formData;

  if (data instanceof File || data instanceof Blob) {
    formData.append(parentKey!, data);
    return formData;
  }

  if (
    typeof data === 'string' ||
    typeof data === 'number' ||
    typeof data === 'boolean'
  ) {
    formData.append(parentKey!, data);
    return formData;
  }

  if (Array.isArray(data)) {
    data.forEach((value, index) => {
      const key = parentKey ? `${parentKey}[${index}]` : `${index}`;
      objectToFormData(value, formData, key);
    });
    return formData;
  }

  if (typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}[${key}]` : key;
      objectToFormData(value, formData, newKey);
    });
    return formData;
  }

  return formData;
}
