/* eslint-disable */
import _classCallCheck from '@babel/runtime/helpers/esm/classCallCheck';
import _createClass from '@babel/runtime/helpers/esm/createClass';
import _createSuper from '@babel/runtime/helpers/esm/createSuper';
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import _extends from '@babel/runtime/helpers/esm/extends';
import _inherits from '@babel/runtime/helpers/esm/inherits';
import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';

/* eslint react/prop-types: 0 */
import classNames from 'classnames';
import React, { cloneElement, isValidElement } from 'react';
import KEYCODE from './KeyCode';
import LOCALE from './locale/zh_CN';
import Options from './Options';
import Pager from './Pager';

function noop() { }

function isInteger(value) {
  return (// eslint-disable-next-line no-restricted-globals
    typeof value === 'number' && isFinite(value) && Math.floor(value) === value
  );
}

function defaultItemRender(page, type, element) {
  return element;
}

function calculatePage(p, state, props) {
  const pageSize = typeof p === 'undefined' ? state.pageSize : p;
  return Math.floor((props.total - 1) / pageSize) + 1;
}

const Pagination = /* #__PURE__*/(function (_React$Component) {
  _inherits(Pagination, _React$Component);

  const _super = _createSuper(Pagination);

  function Pagination(props) {
    let _this;

    _classCallCheck(this, Pagination);

    _this = _super.call(this, props);

    _this.getJumpPrevPage = function () {
      return Math.max(1, _this.state.current - (_this.props.showLessItems ? 3 : 5));
    };

    _this.getJumpNextPage = function () {
      return Math.min(calculatePage(undefined, _this.state, _this.props), _this.state.current + (_this.props.showLessItems ? 3 : 5));
    };

    _this.getItemIcon = function (icon, label) {
      const prefixCls = _this.props.prefixCls;
      let iconNode = icon || /* #__PURE__*/React.createElement('button', {
        type: 'button',
        'aria-label': label,
        className: ''.concat(prefixCls, '-item-link'),
      });

      if (typeof icon === 'function') {
        iconNode = /* #__PURE__*/React.createElement(icon, _objectSpread({}, _this.props));
      }

      return iconNode;
    };

    _this.savePaginationNode = function (node) {
      _this.paginationNode = node;
    };

    _this.isValid = function (page) {
      return isInteger(page) && page !== _this.state.current;
    };

    _this.shouldDisplayQuickJumper = function () {
      const _this$props = _this.props,
        showQuickJumper = _this$props.showQuickJumper,
        pageSize = _this$props.pageSize,
        total = _this$props.total;

      if (total <= pageSize) {
        return false;
      }

      return showQuickJumper;
    };

    _this.handleKeyDown = function (e) {
      if (e.keyCode === KEYCODE.ARROW_UP || e.keyCode === KEYCODE.ARROW_DOWN) {
        e.preventDefault();
      }
    };

    _this.handleKeyUp = function (e) {
      const value = _this.getValidValue(e);

      const currentInputValue = _this.state.currentInputValue;

      if (value !== currentInputValue) {
        _this.setState({ currentInputValue: value });
      }

      if (e.keyCode === KEYCODE.ENTER) {
        _this.handleChange(value);
      } else if (e.keyCode === KEYCODE.ARROW_UP) {
        _this.handleChange(value - 1);
      } else if (e.keyCode === KEYCODE.ARROW_DOWN) {
        _this.handleChange(value + 1);
      }
    };

    _this.changePageSize = function (size) {
      let current = _this.state.current;
      const newCurrent = calculatePage(size, _this.state, _this.props);
      current = current > newCurrent ? newCurrent : current; // fix the issue:
      // Once 'total' is 0, 'current' in 'onShowSizeChange' is 0, which is not correct.

      if (newCurrent === 0) {
        // eslint-disable-next-line prefer-destructuring
        current = _this.state.current;
      }

      if (typeof size === 'number') {
        if (!('pageSize' in _this.props)) {
          _this.setState({ pageSize: size });
        }

        if (!('current' in _this.props)) {
          _this.setState({
            current,
            currentInputValue: current,
          });
        }
      }

      const changePage = _this.props.onShowSizeChange(current, size);

      if (changePage === 'reject') {
        return;
      }

      if ('onChange' in _this.props && _this.props.onChange) {
        _this.props.onChange(current, size);
      }
    };

    _this.handleChange = function (p) {
      const disabled = _this.props.disabled;
      let page = p;

      if (_this.isValid(page) && !disabled) {
        const currentPage = calculatePage(undefined, _this.state, _this.props);

        if (page > currentPage) {
          page = currentPage;
        } else if (page < 1) {
          page = 1;
        }

        if (!('current' in _this.props)) {
          _this.setState({
            current: page,
            currentInputValue: page,
          });
        }

        const pageSize = _this.state.pageSize;

        _this.props.onChange(page, pageSize);

        return page;
      }

      return _this.state.current;
    };

    _this.prev = function () {
      if (_this.hasPrev()) {
        _this.handleChange(_this.state.current - 1);
      }
    };

    _this.next = function () {
      if (_this.hasNext()) {
        _this.handleChange(_this.state.current + 1);
      }
    };

    _this.jumpPrev = function () {
      _this.handleChange(_this.getJumpPrevPage());
    };

    _this.jumpNext = function () {
      _this.handleChange(_this.getJumpNextPage());
    };

    _this.hasPrev = function () {
      return _this.state.current > 1;
    };

    _this.hasNext = function () {
      return _this.state.current < calculatePage(undefined, _this.state, _this.props);
    };

    _this.runIfEnter = function (event, callback) {
      if (event.key === 'Enter' || event.charCode === 13) {
        for (var _len = arguments.length, restParams = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          restParams[_key - 2] = arguments[_key];
        }

        callback.apply(void 0, restParams);
      }
    };

    _this.runIfEnterPrev = function (e) {
      _this.runIfEnter(e, _this.prev);
    };

    _this.runIfEnterNext = function (e) {
      _this.runIfEnter(e, _this.next);
    };

    _this.runIfEnterJumpPrev = function (e) {
      _this.runIfEnter(e, _this.jumpPrev);
    };

    _this.runIfEnterJumpNext = function (e) {
      _this.runIfEnter(e, _this.jumpNext);
    };

    _this.handleGoTO = function (e) {
      if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
        _this.handleChange(_this.state.currentInputValue);
      }
    };

    const hasOnChange = props.onChange !== noop;
    const hasCurrent = ('current' in props);

    if (hasCurrent && !hasOnChange) {
      // eslint-disable-next-line no-console
      console.warn('Warning: You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component.');
    }

    let _current = props.defaultCurrent;

    if ('current' in props) {
      // eslint-disable-next-line prefer-destructuring
      _current = props.current;
    }

    let _pageSize = props.defaultPageSize;

    if ('pageSize' in props) {
      // eslint-disable-next-line prefer-destructuring
      _pageSize = props.pageSize;
    }

    _current = Math.min(_current, calculatePage(_pageSize, undefined, props));
    _this.state = {
      current: _current,
      currentInputValue: _current,
      pageSize: _pageSize,
    };
    return _this;
  }

  _createClass(Pagination, [
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps, prevState) {
        /* When current page change, fix focused style of prev item
           A hacky solution of https://github.com/ant-design/ant-design/issues/8948 */
        const prefixCls = this.props.prefixCls;

        if (prevState.current !== this.state.current && this.paginationNode) {
          const lastCurrentNode = this.paginationNode.querySelector('.'.concat(prefixCls, '-item-').concat(prevState.current));

          if (lastCurrentNode && document.activeElement === lastCurrentNode) {
            lastCurrentNode.blur();
          }
        }
      },
    },
    {
      key: 'getValidValue',
      value: function getValidValue(e) {
        const inputValue = e.target.value;
        const allPages = calculatePage(undefined, this.state, this.props);
        const currentInputValue = this.state.currentInputValue;
        let value;

        if (inputValue === '') {
          value = inputValue; // eslint-disable-next-line no-restricted-globals
        } else if (isNaN(Number(inputValue))) {
          value = currentInputValue;
        } else if (inputValue >= allPages) {
          value = allPages;
        } else {
          value = Number(inputValue);
        }

        return value;
      },
    },
    {
      key: 'getShowSizeChanger',
      value: function getShowSizeChanger() {
        const _this$props2 = this.props,
          showSizeChanger = _this$props2.showSizeChanger,
          total = _this$props2.total,
          totalBoundaryShowSizeChanger = _this$props2.totalBoundaryShowSizeChanger;

        if (typeof showSizeChanger !== 'undefined') {
          return showSizeChanger;
        }

        return total > totalBoundaryShowSizeChanger;
      },
    },
    {
      key: 'renderPrev',
      value: function renderPrev(prevPage) {
        const _this$props3 = this.props,
          prevIcon = _this$props3.prevIcon,
          itemRender = _this$props3.itemRender;
        const prevButton = itemRender(prevPage, 'prev', this.getItemIcon(prevIcon, 'prev page'));
        const disabled = !this.hasPrev();
        return /* #__PURE__*/isValidElement(prevButton) ? /* #__PURE__*/cloneElement(prevButton, { disabled }) : prevButton;
      },
    },
    {
      key: 'renderNext',
      value: function renderNext(nextPage) {
        const _this$props4 = this.props,
          nextIcon = _this$props4.nextIcon,
          itemRender = _this$props4.itemRender;
        const nextButton = itemRender(nextPage, 'next', this.getItemIcon(nextIcon, 'next page'));
        const disabled = !this.hasNext();
        return /* #__PURE__*/isValidElement(nextButton) ? /* #__PURE__*/cloneElement(nextButton, { disabled }) : nextButton;
      },
    },
    {
      key: 'render',
      value: function render() {
        const _this2 = this;

        const _this$props5 = this.props,
          prefixCls = _this$props5.prefixCls,
          className = _this$props5.className,
          style = _this$props5.style,
          disabled = _this$props5.disabled,
          hideOnSinglePage = _this$props5.hideOnSinglePage,
          total = _this$props5.total,
          locale = _this$props5.locale,
          showQuickJumper = _this$props5.showQuickJumper,
          showLessItems = _this$props5.showLessItems,
          showTitle = _this$props5.showTitle,
          showTotal = _this$props5.showTotal,
          simple = _this$props5.simple,
          itemRender = _this$props5.itemRender,
          showPrevNextJumpers = _this$props5.showPrevNextJumpers,
          jumpPrevIcon = _this$props5.jumpPrevIcon,
          jumpNextIcon = _this$props5.jumpNextIcon,
          selectComponentClass = _this$props5.selectComponentClass,
          selectPrefixCls = _this$props5.selectPrefixCls,
          pageSizeOptions = _this$props5.pageSizeOptions;
        const _this$state = this.state,
          current = _this$state.current,
          pageSize = _this$state.pageSize,
          currentInputValue = _this$state.currentInputValue; // When hideOnSinglePage is true and there is only 1 page, hide the pager

        if (hideOnSinglePage === true && total <= pageSize) {
          return null;
        }

        const allPages = calculatePage(undefined, this.state, this.props);
        const pagerList = [];
        let jumpPrev = null;
        let jumpNext = null;
        let firstPager = null;
        let lastPager = null;
        let gotoButton = null;
        const goButton = showQuickJumper && showQuickJumper.goButton;
        const pageBufferSize = showLessItems ? 1 : 2;
        const prevPage = current - 1 > 0 ? current - 1 : 0;
        const nextPage = current + 1 < allPages ? current + 1 : allPages;
        const dataOrAriaAttributeProps = Object.keys(this.props).reduce((prev, key) => {
          if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role') {
            // eslint-disable-next-line no-param-reassign
            prev[key] = _this2.props[key];
          }

          return prev;
        }, {});

        if (simple) {
          if (goButton) {
            if (typeof goButton === 'boolean') {
              gotoButton = /* #__PURE__*/React.createElement('button', {
                type: 'button',
                onClick: this.handleGoTO,
                onKeyUp: this.handleGoTO,
              }, locale.jump_to_confirm);
            } else {
              gotoButton = /* #__PURE__*/React.createElement('span', {
                onClick: this.handleGoTO,
                onKeyUp: this.handleGoTO,
              }, goButton);
            }

            gotoButton = /* #__PURE__*/React.createElement('li', {
              title: showTitle ? ''.concat(locale.jump_to).concat(current, '/')
                .concat(allPages) : null,
              className: ''.concat(prefixCls, '-simple-pager'),
            }, gotoButton);
          }

          return /* #__PURE__*/React.createElement('ul', _extends({
            className: classNames(prefixCls, ''.concat(prefixCls, '-simple'), _defineProperty({}, ''.concat(prefixCls, '-disabled'), disabled), className),
            style,
            ref: this.savePaginationNode,
          }, dataOrAriaAttributeProps), /* #__PURE__*/React.createElement('li', {
            title: showTitle ? locale.prev_page : null,
            onClick: this.prev,
            tabIndex: this.hasPrev() ? 0 : null,
            onKeyPress: this.runIfEnterPrev,
            className: classNames(''.concat(prefixCls, '-prev'), _defineProperty({}, ''.concat(prefixCls, '-disabled'), !this.hasPrev())),
            'aria-disabled': !this.hasPrev(),
          }, this.renderPrev(prevPage)), /* #__PURE__*/React.createElement('li', {
            title: showTitle ? ''.concat(current, '/').concat(allPages) : null,
            className: ''.concat(prefixCls, '-simple-pager'),
          }, /* #__PURE__*/React.createElement('input', {
            type: 'text',
            value: currentInputValue,
            disabled,
            onKeyDown: this.handleKeyDown,
            onKeyUp: this.handleKeyUp,
            onChange: this.handleKeyUp,
            size: '3',
          }), /* #__PURE__*/React.createElement('span', { className: ''.concat(prefixCls, '-slash') }, '/'), allPages), /* #__PURE__*/React.createElement('li', {
            title: showTitle ? locale.next_page : null,
            onClick: this.next,
            tabIndex: this.hasPrev() ? 0 : null,
            onKeyPress: this.runIfEnterNext,
            className: classNames(''.concat(prefixCls, '-next'), _defineProperty({}, ''.concat(prefixCls, '-disabled'), !this.hasNext())),
            'aria-disabled': !this.hasNext(),
          }, this.renderNext(nextPage)), gotoButton);
        }

        if (allPages <= 3 + pageBufferSize * 2) {
          const pagerProps = {
            locale,
            rootPrefixCls: prefixCls,
            onClick: this.handleChange,
            onKeyPress: this.runIfEnter,
            showTitle,
            itemRender,
          };

          if (!allPages) {
            pagerList.push(/* #__PURE__*/React.createElement(Pager, _extends({}, pagerProps, {
              key: 'noPager',
              page: allPages,
              className: ''.concat(prefixCls, '-disabled'),
            })));
          }

          for (let i = 1; i <= allPages; i += 1) {
            const active = current === i;
            pagerList.push(/* #__PURE__*/React.createElement(Pager, _extends({}, pagerProps, {
              key: i,
              page: i,
              active,
            })));
          }
        } else {
          const prevItemTitle = showLessItems ? locale.prev_3 : locale.prev_5;
          const nextItemTitle = showLessItems ? locale.next_3 : locale.next_5;

          if (showPrevNextJumpers) {
            jumpPrev = /* #__PURE__*/React.createElement('li', {
              title: showTitle ? prevItemTitle : null,
              key: 'prev',
              onClick: this.jumpPrev,
              tabIndex: '0',
              onKeyPress: this.runIfEnterJumpPrev,
              className: classNames(''.concat(prefixCls, '-jump-prev'), _defineProperty({}, ''.concat(prefixCls, '-jump-prev-custom-icon'), Boolean(jumpPrevIcon))),
            }, itemRender(this.getJumpPrevPage(), 'jump-prev', this.getItemIcon(jumpPrevIcon, 'prev page')));
            jumpNext = /* #__PURE__*/React.createElement('li', {
              title: showTitle ? nextItemTitle : null,
              key: 'next',
              tabIndex: '0',
              onClick: this.jumpNext,
              onKeyPress: this.runIfEnterJumpNext,
              className: classNames(''.concat(prefixCls, '-jump-next'), _defineProperty({}, ''.concat(prefixCls, '-jump-next-custom-icon'), Boolean(jumpNextIcon))),
            }, itemRender(this.getJumpNextPage(), 'jump-next', this.getItemIcon(jumpNextIcon, 'next page')));
          }

          lastPager = /* #__PURE__*/React.createElement(Pager, {
            locale,
            last: true,
            rootPrefixCls: prefixCls,
            onClick: this.handleChange,
            onKeyPress: this.runIfEnter,
            key: allPages,
            page: allPages,
            active: false,
            showTitle,
            itemRender,
          });
          firstPager = /* #__PURE__*/React.createElement(Pager, {
            locale,
            rootPrefixCls: prefixCls,
            onClick: this.handleChange,
            onKeyPress: this.runIfEnter,
            key: 1,
            page: 1,
            active: false,
            showTitle,
            itemRender,
          });
          let left = Math.max(1, current - pageBufferSize);
          let right = Math.min(current + pageBufferSize, allPages);

          if (current - 1 <= pageBufferSize) {
            right = 1 + pageBufferSize * 2;
          }

          if (allPages - current <= pageBufferSize) {
            left = allPages - pageBufferSize * 2;
          }

          for (let _i = left; _i <= right; _i += 1) {
            const _active = current === _i;

            pagerList.push(/* #__PURE__*/React.createElement(Pager, {
              locale,
              rootPrefixCls: prefixCls,
              onClick: this.handleChange,
              onKeyPress: this.runIfEnter,
              key: _i,
              page: _i,
              active: _active,
              showTitle,
              itemRender,
            }));
          }

          if (current - 1 >= pageBufferSize * 2 && current !== 1 + 2) {
            pagerList[0] = /* #__PURE__*/cloneElement(pagerList[0], { className: ''.concat(prefixCls, '-item-after-jump-prev') });
            pagerList.unshift(jumpPrev);
          }

          if (allPages - current >= pageBufferSize * 2 && current !== allPages - 2) {
            pagerList[pagerList.length - 1] = /* #__PURE__*/cloneElement(pagerList[pagerList.length - 1], { className: ''.concat(prefixCls, '-item-before-jump-next') });
            pagerList.push(jumpNext);
          }

          if (left !== 1) {
            pagerList.unshift(firstPager);
          }

          if (right !== allPages) {
            pagerList.push(lastPager);
          }
        }

        let totalText = null;

        if (showTotal) {
          totalText = /* #__PURE__*/React.createElement('li', { className: ''.concat(prefixCls, '-total-text') }, showTotal(total, [
            total === 0 ? 0 : (current - 1) * pageSize + 1,
            current * pageSize > total ? total : current * pageSize,
          ]));
        }

        const prevDisabled = !this.hasPrev() || !allPages;
        const nextDisabled = !this.hasNext() || !allPages;
        return /* #__PURE__*/React.createElement('ul', _extends({
          className: classNames(prefixCls, className, _defineProperty({}, ''.concat(prefixCls, '-disabled'), disabled)),
          style,
          unselectable: 'unselectable',
          ref: this.savePaginationNode,
        }, dataOrAriaAttributeProps), totalText, /* #__PURE__*/React.createElement('li', {
          title: showTitle ? locale.prev_page : null,
          onClick: this.prev,
          tabIndex: prevDisabled ? null : 0,
          onKeyPress: this.runIfEnterPrev,
          className: classNames(''.concat(prefixCls, '-prev'), _defineProperty({}, ''.concat(prefixCls, '-disabled'), prevDisabled)),
          'aria-disabled': prevDisabled,
        }, this.renderPrev(prevPage)), pagerList, /* #__PURE__*/React.createElement('li', {
          title: showTitle ? locale.next_page : null,
          onClick: this.next,
          tabIndex: nextDisabled ? null : 0,
          onKeyPress: this.runIfEnterNext,
          className: classNames(''.concat(prefixCls, '-next'), _defineProperty({}, ''.concat(prefixCls, '-disabled'), nextDisabled)),
          'aria-disabled': nextDisabled,
        }, this.renderNext(nextPage)), /* #__PURE__*/React.createElement(Options, {
          disabled,
          locale,
          rootPrefixCls: prefixCls,
          selectComponentClass,
          selectPrefixCls,
          changeSize: this.getShowSizeChanger() ? this.changePageSize : null,
          current,
          pageSize,
          pageSizeOptions,
          quickGo: this.shouldDisplayQuickJumper() ? this.handleChange : null,
          goButton,
        }));
      },
    },
  ], [
    {
      key: 'getDerivedStateFromProps',
      value: function getDerivedStateFromProps(props, prevState) {
        const newState = {};

        if ('current' in props) {
          newState.current = props.current;

          if (props.current !== prevState.current) {
            newState.currentInputValue = newState.current;
          }
        }

        if ('pageSize' in props && props.pageSize !== prevState.pageSize) {
          let current = prevState.current;
          const newCurrent = calculatePage(props.pageSize, prevState, props);
          current = current > newCurrent ? newCurrent : current;

          if (!('current' in props)) {
            newState.current = current;
            newState.currentInputValue = current;
          }

          newState.pageSize = props.pageSize;
        }

        return newState;
      },
    },
  ]);

  return Pagination;
}(React.Component));

Pagination.defaultProps = {
  defaultCurrent: 1,
  total: 0,
  defaultPageSize: 10,
  onChange: noop,
  className: '',
  selectPrefixCls: 'rc-select',
  prefixCls: 'rc-pagination',
  selectComponentClass: null,
  hideOnSinglePage: false,
  showPrevNextJumpers: true,
  showQuickJumper: false,
  showLessItems: false,
  showTitle: true,
  onShowSizeChange: noop,
  locale: LOCALE,
  style: {},
  itemRender: defaultItemRender,
  totalBoundaryShowSizeChanger: 50,
};
export default Pagination;
