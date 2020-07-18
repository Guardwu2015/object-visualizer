import UndefinedWrapper from "./UndefinedWrapper";
import NullWrapper from "./NullWrapper";
import BooleanWrapper from "./BooleanWrapper";
import NumberWrapper from "./NumberWrapper";
import StringWrapper from "./StringWrapper";
import { toString } from "../util";
import { useExpand } from "../hooks";

const types = new Set([
  "Undefined",
  "Null",
  "Boolean",
  "Number",
  "String",
  "Array",
  "Object",
]);

const ArrayWrapper = {
  name: "array-wrapper",
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Array";
      },
    },
    name: {
      required: true,
      type: String,
    },
    collapseSignal: {
      default: false,
      type: Boolean,
    },
    expandSignal: {
      default: false,
      type: Boolean,
    },
  },
  setup(props) {
    const {
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    } = useExpand(props);

    return {
      representingType: toString(props.data),
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    };
  },
  components: {
    // Wrapper,
  },
  template: `
    <span class="array">
      <span
        class="indicator"
        @click="handleClick"
      >{{ isExpanding ? '\u25BC' : '\u25B6' }}</span>
      <span
        class="key"
        @click="handleClick"
      >{{ name === '' ? '' : name }}</span>
      <span
        class="separator"
        @click="handleClick"
      >{{ name === '' ? '' : ': ' }}</span>
      <span
        class="count"
        @click="handleClick"
      >
        {{ isExpanding === false && data.length >= 2 ? '(' + data.length + ')' : '' }}
      </span>
      <span
        class="preview"
        @click="handleClick"
      >
        {{ isExpanding ? 'Array(' + data.length + ')' : '[...]' }}
      </span>

      <span v-show="isExpanding" class="value">
        <wrapper
          v-for="(value, index) of data"
          :name="index + ''"
          :data="data[index]"
          :expand-signal="innerExpandSignal"
          :collapse-signal="innerCollapseSignal"
        ></wrapper>
      </span>
    </span>
  `,
};

const ObjectWrapper = {
  name: "object-wrapper",
  props: {
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Object";
      },
    },
    name: {
      required: true,
      type: String,
    },
    collapseSignal: {
      default: false,
      type: Boolean,
    },
    expandSignal: {
      default: false,
      type: Boolean,
    },
  },
  setup(props) {
    const {
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    } = useExpand(props);

    return {
      representingType: toString(props.data),
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    };
  },
  components: {
    // Wrapper,
  },
  template: `
    <span class="object">
      <span
        class="indicator"
        @click="handleClick"
      >{{ isExpanding ? '\u25BC' : '\u25B6' }}</span>
      <span
        class="key"
        @click="handleClick"
      >{{ name === '' ? '' : name }}</span>
      <span
        class="separator"
        @click="handleClick"
      >
        {{ name === '' ? '' : ': ' }}
      </span>
      <span
        class="preview"
        @click="handleClick"
      >
        {{ isExpanding ? '' : '{...}' }}
      </span>

      <span v-show="isExpanding" class="value">
        <wrapper
          v-for="key of Object.keys(data).sort()"
          class="value"
          :name="key"
          :data="data[key]"
          :expand-signal="innerExpandSignal"
          :collapse-signal="innerCollapseSignal"
        ></wrapper>
      </span>
    </span>
  `,
};

const Wrapper = {
  name: "wrapper",
  props: {
    data: {
      required: true,
      validator(data) {
        return types.has(toString(data));
      },
    },
    name: {
      required: true,
      type: String,
    },
    collapseSignal: {
      default: false,
      type: Boolean,
    },
    expandSignal: {
      default: false,
      type: Boolean,
    },
  },
  setup(props) {
    return {
      representingType: toString(props.data),
    };
  },
  components: {
    UndefinedWrapper,
    NullWrapper,
    BooleanWrapper,
    NumberWrapper,
    StringWrapper,
    ArrayWrapper,
    ObjectWrapper,
  },
  template: `
    <undefined-wrapper
      v-if="representingType === 'Undefined'"
      :name="name"
      :data="data"
    ></undefined-wrapper>

    <null-wrapper
      v-else-if="representingType === 'Null'"
      :name="name"
      :data="data"
    ></null-wrapper>

    <boolean-wrapper
      v-else-if="representingType === 'Boolean'"
      :name="name"
      :data="data"
    ></boolean-wrapper>

    <number-wrapper
      v-else-if="representingType === 'Number'"
      :name="name"
      :data="data"
    ></number-wrapper>

    <string-wrapper
      v-else-if="representingType === 'String'"
      :name="name"
      :data="data"
    ></string-wrapper>

    <array-wrapper
      v-else-if="representingType === 'Array'"
      :name="name"
      :data="data"
      :collapse-signal="collapseSignal"
      :expand-signal="expandSignal"
    ></array-wrapper>

    <object-wrapper
      v-else-if="representingType === 'Object'"
      :name="name"
      :data="data"
      :collapse-signal="collapseSignal"
      :expand-signal="expandSignal"
    ></object-wrapper>
  `,
};

ArrayWrapper.components.Wrapper = Wrapper;
ObjectWrapper.components.Wrapper = Wrapper;

export default Wrapper;
