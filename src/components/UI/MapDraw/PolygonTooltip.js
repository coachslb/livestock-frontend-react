import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'material-ui';

/* global google */
const PolygonTooltip = ({ polygons, polygon, removePolygon, removeAllPolygons, editable, i18n }) => {
  const area = (google.maps.geometry.spherical.computeArea(polygon.getPath()) / 10000).toFixed(3);

  const totalArea = (polygons.reduce((acc, p) => acc + google.maps.geometry.spherical.computeArea(p.getPath()), 0) / 10000).toFixed(3);

  return (
    <div className="MapDraw_Tooltip">
      <div>
        {i18n.area}: {area} Ha
      </div>
      <div>
        {i18n.totalArea}: {totalArea} Ha
      </div>
      {editable && (
        <div className="MapDraw_Tooltip-actions">
          <Button onClick={() => removePolygon(polygon)}>
            {i18n.delete}
          </Button>
          <Button onClick={removeAllPolygons}>
            {i18n.deleteAll}
          </Button>
        </div>
      )}
    </div>
  );
};

PolygonTooltip.propTypes = {
  polygons: PropTypes.array,
  polygon: PropTypes.object,
  removePolygon: PropTypes.func,
  removeAllPolygons: PropTypes.func,
  editable: PropTypes.bool,
  i18n: PropTypes.object,
};

export default PolygonTooltip;
