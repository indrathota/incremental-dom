/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var IncrementalDOM = require('../../index'),
    patch = IncrementalDOM.patch,
    elementVoid = IncrementalDOM.elementVoid,
    attributes = IncrementalDOM.attributes;

describe('library hooks', () => {
  var container;
  var sandbox = sinon.sandbox.create();

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    sandbox.restore();
  });

  describe('for deciding how attributes are set', () => {
    function render(dynamicValue) {
      elementVoid('div', null, ['staticName', 'staticValue'],
          'dynamicName', dynamicValue);
    }

    beforeEach(() => {
      sandbox.spy(attributes, 'applyAttr');
    });
  
    it('should be called for static attributes', () => {
      patch(container, render, 'dynamicValue');
      var el = container.childNodes[0];

      expect(attributes.applyAttr).calledWith(el, 'staticName', 'staticValue');
    });

    it('should be called for dynamic attributes', () => {
      patch(container, render, 'dynamicValue');
      var el = container.childNodes[0];

      expect(attributes.applyAttr).calledWith(el, 'dynamicName', 'dynamicValue');
    });

    it('should be called on attribute update', () => {
      patch(container, render, 'dynamicValueOne');
      patch(container, render, 'dynamicValueTwo');
      var el = container.childNodes[0];

      expect(attributes.applyAttr).calledWith(el, 'dynamicName', 'dynamicValueTwo');
    });

    it('should allow only be called when attributes change', () => {
      patch(container, render, 'dynamicValue');
      patch(container, render, 'dynamicValue');

      // Called once for the static attribute and once for the dynamic one
      expect(attributes.applyAttr).calledTwice;
    });
  });
});

