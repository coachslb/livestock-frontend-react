export const formatDate = d => {
  return d
    .slice(0, 10)
    .split('-')
    .reverse()
    .join('/');
};
