/**
 * @license
 * PageVisibility Module v0.0.1
 * (c) 2015 Manuel Lang (http://magnal.de)
 * License: MIT
 */
(function(exports, document)
{
    'use strict';

    var pagevis = exports.pagevis = exports.pagevis || {};

    pagevis.currentlyHidden = undefined;
    pagevis.currentVisibilityState = undefined;
    pagevis.whenVisibilityChanges = whenVisibilityChanges;
    pagevis.whenHidden = whenHidden;
    pagevis.whenVisible = whenVisible;
    pagevis.whenNotSupported = whenNotSupported;

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
            updateCurrentlyHidden();
            updateCurrentVisibilityState();

            if (_support)
            {
                callSupportedCallbacks();
            }
            else
            {
                callNotSupportedCallbacks();
            }
        });

        // if support is available, register eventlistener
        if (_support)
        {
            updateCurrentlyHidden();
            updateCurrentVisibilityState();

            document.addEventListener(_eventName, function()
            {
                callSupportedCallbacks();
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

    function callSupportedCallbacks ()
    {
        callCallbacks(_callbacks);
        if (pagevis.currentlyHidden)
        {
            callCallbacks(_callbacksWhenHidden);
        }
        else
        {
            callCallbacks(_callbacksWhenVisible);
        }
    }

    function callCallbacks (callbacks)
    {
        if (callbacks)
        {
            callbacks.forEach(function(callback)
            {
                callback(pagevis.currentlyHidden, pagevis.currentVisibilityState);
            });
        }
    }

    function callNotSupportedCallbacks ()
    {
        if (_callbacksWhenNotSupported)
        {
            _callbacksWhenNotSupported.forEach(function(callback)
            {
                callback();
            });
        }
    }

    function updateCurrentlyHidden ()
    {
        pagevis.currentlyHidden = document[_hiddenPropName];
    }

    function updateCurrentVisibilityState ()
    {
        pagevis.currentVisibilityState = document[_statePropName];
    }
})(window, window.document);