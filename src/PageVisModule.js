;window.pageVis = (function(pageVis, document)
{
    'use strict';

    pageVis.whenVisibilityChanges = whenVisibilityChanges;
    pageVis.whenHidden = whenHidden;
    pageVis.whenVisible = whenVisible;
    pageVis.whenNotSupported = whenNotSupported;

    var _support = false;
    var _hiddenPropName = null;
    var _statePropName = null;
    var _eventName = null;
    var _callbacks = null;
    var _callbacksWhenHidden = null;
    var _callbacksWhenVisible = null;
    var _callbacksWhenNotSupported = null;

    setup();

    function setup ()
    {
        // initial check for support (copied from MDN)
        if (typeof document.hidden !== 'undefined')
        { // Opera 12.10 and Firefox 18 and later support
            _hiddenPropName = 'hidden';
            _statePropName = 'visibilityState';
            _eventName = 'visibilitychange';
            _support = true;
        }
        else if (typeof document.mozHidden !== 'undefined')
        {
            _hiddenPropName = 'mozHidden';
            _statePropName = 'mozVisibilityState';
            _eventName = 'mozvisibilitychange';
            _support = true;
        }
        else if (typeof document.msHidden !== 'undefined')
        {
            _hiddenPropName = 'msHidden';
            _statePropName = 'msVisibilityState';
            _eventName = 'msvisibilitychange';
            _support = true;
        }
        else if (typeof document.webkitHidden !== 'undefined')
        {
            _hiddenPropName = 'webkitHidden';
            _statePropName = 'webkitVisibilityState';
            _eventName = 'webkitvisibilitychange';
            _support = true;
        }

        document.addEventListener('DOMContentLoaded', function()
        {
            if (_support)
            {
                callCallbacks(_callbacks);
                if (getCurrentlyHidden())
                {
                    callCallbacks(_callbacksWhenHidden);
                }
                else
                {
                    callCallbacks(_callbacksWhenVisible);
                }
            }
            else
            {
                callCallbacks(_callbacksWhenNotSupported, false);
            }
        });

        // if support is available, register eventlistener
        if (_support)
        {
            document.addEventListener(_eventName, function()
            {
                callCallbacks(_callbacks);
                if (getCurrentlyHidden())
                {
                    callCallbacks(_callbacksWhenHidden);
                }
                else
                {
                    callCallbacks(_callbacksWhenVisible);
                }
            });
        }
    }

    function whenVisibilityChanges (callback)
    {
        if (!_callbacks)
        {
            _callbacks = [];
        }
        _callbacks.push(callback);
    }

    function whenHidden (callback)
    {
        if (!_callbacksWhenHidden)
        {
            _callbacksWhenHidden = [];
        }
        _callbacksWhenHidden.push(callback);
    }

    function whenVisible (callback)
    {
        if (!_callbacksWhenVisible)
        {
            _callbacksWhenVisible = [];
        }
        _callbacksWhenVisible.push(callback);
    }

    function whenNotSupported (callback)
    {
        if (!_callbacksWhenNotSupported)
        {
            _callbacksWhenNotSupported = [];
        }
        _callbacksWhenNotSupported.push(callback);
    }

    function callCallbacks (callbacks, withData)
    {
        withData = withData || true;
        if (callbacks)
        {
            callbacks.forEach(function(callback)
            {
                if (withData)
                {
                    callback(getCurrentlyHidden(), getCurrentVisibilityState());
                }
                else
                {
                    callback();
                }
            });
        }
    }

    function getCurrentlyHidden ()
    {
        return document[_hiddenPropName];
    }

    function getCurrentVisibilityState ()
    {
        return document[_statePropName];
    }

    return pageVis;

})(window.pageVis || {}, window.document);