/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal.js");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.proto = (function() {

    /**
     * Namespace proto.
     * @exports proto
     * @namespace
     */
    var proto = {};

    proto.Bar = (function() {

        /**
         * Properties of a Bar.
         * @memberof proto
         * @interface IBar
         * @property {number|null} [bar] Bar bar
         */

        /**
         * Constructs a new Bar.
         * @memberof proto
         * @classdesc Represents a Bar.
         * @implements IBar
         * @constructor
         * @param {proto.IBar=} [properties] Properties to set
         */
        function Bar(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Bar bar.
         * @member {number} bar
         * @memberof proto.Bar
         * @instance
         */
        Bar.prototype.bar = 0;

        /**
         * Creates a new Bar instance using the specified properties.
         * @function create
         * @memberof proto.Bar
         * @static
         * @param {proto.IBar=} [properties] Properties to set
         * @returns {proto.Bar} Bar instance
         */
        Bar.create = function create(properties) {
            return new Bar(properties);
        };

        /**
         * Encodes the specified Bar message. Does not implicitly {@link proto.Bar.verify|verify} messages.
         * @function encode
         * @memberof proto.Bar
         * @static
         * @param {proto.IBar} message Bar message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Bar.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.bar != null && Object.hasOwnProperty.call(message, "bar"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.bar);
            return writer;
        };

        /**
         * Encodes the specified Bar message, length delimited. Does not implicitly {@link proto.Bar.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Bar
         * @static
         * @param {proto.IBar} message Bar message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Bar.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Bar message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Bar
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Bar} Bar
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Bar.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Bar();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.bar = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Bar message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Bar
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Bar} Bar
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Bar.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Bar message.
         * @function verify
         * @memberof proto.Bar
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Bar.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.bar != null && message.hasOwnProperty("bar"))
                if (!$util.isInteger(message.bar))
                    return "bar: integer expected";
            return null;
        };

        /**
         * Creates a Bar message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Bar
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Bar} Bar
         */
        Bar.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Bar)
                return object;
            var message = new $root.proto.Bar();
            if (object.bar != null)
                message.bar = object.bar | 0;
            return message;
        };

        /**
         * Creates a plain object from a Bar message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Bar
         * @static
         * @param {proto.Bar} message Bar
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Bar.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.bar = 0;
            if (message.bar != null && message.hasOwnProperty("bar"))
                object.bar = message.bar;
            return object;
        };

        /**
         * Converts this Bar to JSON.
         * @function toJSON
         * @memberof proto.Bar
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Bar.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Bar;
    })();

    proto.Foo = (function() {

        /**
         * Properties of a Foo.
         * @memberof proto
         * @interface IFoo
         * @property {number|null} [foo] Foo foo
         */

        /**
         * Constructs a new Foo.
         * @memberof proto
         * @classdesc Represents a Foo.
         * @implements IFoo
         * @constructor
         * @param {proto.IFoo=} [properties] Properties to set
         */
        function Foo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Foo foo.
         * @member {number} foo
         * @memberof proto.Foo
         * @instance
         */
        Foo.prototype.foo = 0;

        /**
         * Creates a new Foo instance using the specified properties.
         * @function create
         * @memberof proto.Foo
         * @static
         * @param {proto.IFoo=} [properties] Properties to set
         * @returns {proto.Foo} Foo instance
         */
        Foo.create = function create(properties) {
            return new Foo(properties);
        };

        /**
         * Encodes the specified Foo message. Does not implicitly {@link proto.Foo.verify|verify} messages.
         * @function encode
         * @memberof proto.Foo
         * @static
         * @param {proto.IFoo} message Foo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Foo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.foo != null && Object.hasOwnProperty.call(message, "foo"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.foo);
            return writer;
        };

        /**
         * Encodes the specified Foo message, length delimited. Does not implicitly {@link proto.Foo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Foo
         * @static
         * @param {proto.IFoo} message Foo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Foo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Foo message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Foo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Foo} Foo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Foo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Foo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.foo = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Foo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Foo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Foo} Foo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Foo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Foo message.
         * @function verify
         * @memberof proto.Foo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Foo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.foo != null && message.hasOwnProperty("foo"))
                if (!$util.isInteger(message.foo))
                    return "foo: integer expected";
            return null;
        };

        /**
         * Creates a Foo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Foo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Foo} Foo
         */
        Foo.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Foo)
                return object;
            var message = new $root.proto.Foo();
            if (object.foo != null)
                message.foo = object.foo | 0;
            return message;
        };

        /**
         * Creates a plain object from a Foo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Foo
         * @static
         * @param {proto.Foo} message Foo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Foo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.foo = 0;
            if (message.foo != null && message.hasOwnProperty("foo"))
                object.foo = message.foo;
            return object;
        };

        /**
         * Converts this Foo to JSON.
         * @function toJSON
         * @memberof proto.Foo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Foo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Foo;
    })();

    return proto;
})();


exports.root = $root;
