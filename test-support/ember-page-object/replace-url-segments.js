const { keys } = Object;

export default function(definition, segments) {
  const segmentNames = keys(segments);
  let url = definition;

  segmentNames.forEach((name) => {
    url = url.replace(`:${name}`, segments[name]);
  });

  return url;
}
