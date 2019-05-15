## Velay

使用 TypeScript 以 OOP 的方式写 Vue 和 Vuex store.

## Requirements

```json
// tsconfig.json

{
    "compilerOptions": {
        ...
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        ...
    }
}
```

## Usage

### Write Store Class

```ts
// my-store.ts
import { Injectable, State, StoreService } from 'velay';

export class MyStoreService extends StoreService {
    @State
    count: number = 0;

    @State
    title: string = 'hello, velay';

    @State
    list: { name: string; count: number }[] = [{ name: 'velay1', count: 1 }, { name: 'velay2', count: 2 }];

    changeTitle(title: string) {
        this.title = title;
    }

    addCount() {
        this.count = this.count + 1;
    }
}
```

### Write Component

```ts
// my-component.vue
<template>
    <div>
        <h2>{{ store.title }}{{ store.count }}</h2>
        <ul>
            <li v-for="(item, index) in store.list" :key="index">
                <div>{{ item.name }}-{{ item.count }}</div>
            </li>
        </ul>
        <button @click="store.changeTitle('new hello')">Change title</button>
        <button @click="store.addCount">Add count</button>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'velay';
import { MyStoreService } from './my-store';

@Component({})
export default class MyComponent extends Vue {
    constructor(private readonly store: MyStoreService) {
        super();
    }

    mounted() {
        console.log('store', this.store);
    }
}
</script>
```

## More

### Vetur

开启模板语法检查，配合 velay 获得更佳的强类型校验

```json
{
    "vetur.experimental.templateInterpolationService": true
}
```

### Augmenting Vue Types

[https://vuejs.org/v2/guide/typescript.html#Augmenting-Types-for-Use-with-Plugins](https://vuejs.org/v2/guide/typescript.html#Augmenting-Types-for-Use-with-Plugins)
