import { Typography } from 'antd';
import _ from 'lodash';
import React from 'react';
import type { ValueAndLabelData } from './types';

/**
 * @internal
 */
export function formatValueAndLabelData(data: ValueAndLabelData): ValueAndLabelData {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      ...item,
      children: Array.isArray(item.children) && item.children.length ? formatValueAndLabelData(item.children) : undefined,
      value: _.toString(item.value),
      label: _.toString(item.label),
    }));
  } else {
    return [];
  }
}

/**
 * @internal
 */
export function FilterItemLabel({
  labelWidth,
  label,
  required,
}: { labelWidth: number; label: string; required: boolean; }) {
  return (
    <div
      className="filterLabel mark-option"
      style={{
        width: labelWidth,
        maxWidth: labelWidth,
      }}
      title={label}
    >
      <Typography.Title
        ellipsis={{ rows: 1 }}
        level={3}
        title={label}
      >
        {
          required ? (
            <span style={{
              verticalAlign: 'middle',
              color: '#ff4d4f',
            }}
            >
              *
            </span>
          ) : null
        }
        {label}
      </Typography.Title>
    </div>
  );
}

export function trimWhiteSpace(value: string, isTrimWhiteSpace: boolean): string {
  if (isTrimWhiteSpace) {
    return _.flowRight([
      _.trimEnd,
      _.trimStart,
      _.toString,
    ])(value);
  } else {
    return _.toString(value);
  }
}
