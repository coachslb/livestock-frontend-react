const scripts = {};
// eslint-disable-next-line import/prefer-default-export
export const loadScripts = (url, callback) => {
  if (scripts[url]) {
    if (scripts[url].complete) callback();
    else scripts[url].callbacks.push(callback);
    return;
  }

  scripts[url] = { callbacks: [callback] };

  const scriptTag = document.createElement('script');
  scriptTag.defer = true;
  scriptTag.async = true;
  scriptTag.onload = () => {
    scripts[url].complete = true;
    scripts[url].callbacks.forEach(f => f());
  };

  scriptTag.src = url;
  document.head.appendChild(scriptTag);
  // console.log('load scripts', document.head.querySelector('script'));
};
