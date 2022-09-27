import * as $protobuf from "protobufjs";
import * as Long from "long";
// DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run types'.

/** Namespace proto. */
export namespace proto {

    /** Properties of a Bar. */
    interface IBar {

        /** Bar bar */
        bar?: (number|null);
    }

    /** Represents a Bar. */
    class Bar implements IBar {

        /**
         * Constructs a new Bar.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IBar);

        /** Bar bar. */
        public bar: number;

        /**
         * Creates a new Bar instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Bar instance
         */
        public static create(properties?: proto.IBar): proto.Bar;

        /**
         * Encodes the specified Bar message. Does not implicitly {@link proto.Bar.verify|verify} messages.
         * @param message Bar message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IBar, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Bar message, length delimited. Does not implicitly {@link proto.Bar.verify|verify} messages.
         * @param message Bar message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IBar, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Bar message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Bar
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.Bar;

        /**
         * Decodes a Bar message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Bar
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.Bar;

        /**
         * Verifies a Bar message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Bar message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Bar
         */
        public static fromObject(object: { [k: string]: any }): proto.Bar;

        /**
         * Creates a plain object from a Bar message. Also converts values to other types if specified.
         * @param message Bar
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.Bar, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Bar to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Foo. */
    interface IFoo {

        /** Foo foo */
        foo?: (number|null);
    }

    /** Represents a Foo. */
    class Foo implements IFoo {

        /**
         * Constructs a new Foo.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IFoo);

        /** Foo foo. */
        public foo: number;

        /**
         * Creates a new Foo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Foo instance
         */
        public static create(properties?: proto.IFoo): proto.Foo;

        /**
         * Encodes the specified Foo message. Does not implicitly {@link proto.Foo.verify|verify} messages.
         * @param message Foo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IFoo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Foo message, length delimited. Does not implicitly {@link proto.Foo.verify|verify} messages.
         * @param message Foo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IFoo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Foo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Foo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.Foo;

        /**
         * Decodes a Foo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Foo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.Foo;

        /**
         * Verifies a Foo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Foo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Foo
         */
        public static fromObject(object: { [k: string]: any }): proto.Foo;

        /**
         * Creates a plain object from a Foo message. Also converts values to other types if specified.
         * @param message Foo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.Foo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Foo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LargeNumber. */
    interface ILargeNumber {

        /** LargeNumber strNum */
        strNum?: (string|null);

        /** LargeNumber longNum */
        longNum?: (number|Long|null);
    }

    /** Represents a LargeNumber. */
    class LargeNumber implements ILargeNumber {

        /**
         * Constructs a new LargeNumber.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ILargeNumber);

        /** LargeNumber strNum. */
        public strNum: string;

        /** LargeNumber longNum. */
        public longNum: (number|Long);

        /**
         * Creates a new LargeNumber instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LargeNumber instance
         */
        public static create(properties?: proto.ILargeNumber): proto.LargeNumber;

        /**
         * Encodes the specified LargeNumber message. Does not implicitly {@link proto.LargeNumber.verify|verify} messages.
         * @param message LargeNumber message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ILargeNumber, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LargeNumber message, length delimited. Does not implicitly {@link proto.LargeNumber.verify|verify} messages.
         * @param message LargeNumber message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ILargeNumber, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LargeNumber message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LargeNumber
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.LargeNumber;

        /**
         * Decodes a LargeNumber message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LargeNumber
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.LargeNumber;

        /**
         * Verifies a LargeNumber message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LargeNumber message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LargeNumber
         */
        public static fromObject(object: { [k: string]: any }): proto.LargeNumber;

        /**
         * Creates a plain object from a LargeNumber message. Also converts values to other types if specified.
         * @param message LargeNumber
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.LargeNumber, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LargeNumber to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
