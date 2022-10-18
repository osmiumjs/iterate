# @osmium/iterate

### About

### Installation

Just use command:

```
 npm i --save @osmium/iterate
```

And import iterator function what you need (see API), for example universal sync/async value-key iterator:

```
{iterate} from '@osmium/iterate'
```

### Usage
```
```

### Iteration

Can iterate this types (async versions/modes also support Promise of them)

* `Array`
* `object`
* Iterable`object` with keys `[Symbol.iterator]` / `[Symbol.asyncIterator]`
* `Set`
* `Map`
* `string` - iterate each char in string
* `number` - certain number of times
* `true` - until inter.break() called
```
```

### Async
Support only native ES Promises

**IMPORTANT NOTICE!**

Be carefull with code compilers like `Babel` -
such things often turn asynchronous functions into synchronous,
without the ability to determine their type in run-time through
`constructor.name='AsyncFunction'`or a rather specific code pattern
from compiled function source text

### Mapping

* `Array`
* `Object`
* `Set`
* `Map`
* `number` - count not `undefined` returns from iterator callback

Set boolean to true if iterator callback returned something other than `undefined`

```
```

### Chunks

```
```

### API

#### iterateSync
Reference: `iterateSync(values: Iterable, cb: (value, idx, control: Control)=> mapRow|undefined, map?:Mappable, mapUndefined?:true): MapResult|undefined`

Iterate `values` using synchronously callback, mapping result also synchronously.
```
```

#### iterateAsync
Reference: `iterateAsync(values: Iterable, cb: async(value, idx, control: Control)=> Promise<mapRow|undefined>, map?:Mappable, mapUndefined?:true): Promise<MapResult|undefined>`

Iterate `values` using asynchronously callback, mapping result also asynchronously.
```
```

#### iterate
Reference sync: `iterate(values: Iterable, cb: (value, idx, control: Control)=> mapRow|undefined, map?:Mappable, mapUndefined?:true): MapResult|undefined`

Reference async: `iterate(values: Iterable, cb: async(value, idx, control: Control)=> Promise<mapRow|undefined>, map?:Mappable, mapUndefined?:true): Promise<MapResult|undefined>`

Try to detect callback type - if callback sync - used `iterateSync` else used `iterateAsync`
```
```

#### iterateKeysSync
Reference: `1`

Same as `iterateSync`, but arguments order in callback changed - (idx, value, control)
```
```

#### iterateKeysAsync
Reference: `1`

Same as `iterateAsync`, but arguments order in callback changed - (idx, value, control)
```
```

#### iterateKeys
Reference: `1`

Same as `iterate`, but arguments order in callback changed - (idx, value, control)
```
```

#### iterateParallel
Reference: `1`

Same as `iterateAsync`, but сallbacks run in parallel like `Promise.all`. 
```
```

#### iterateKeysParallel
Reference: `1`

Same as `iterateAsync`, but сallbacks run in parallel like `Promise.all`.
Arguments order in callback changed - (idx, value, control)
```
```

#### iterateKeysParallelLimit
Reference: `1`

Same as `iterateKeysParallel`, but сallbacks run in parallel batches like `Promise.all` with `limit`.
```
```

#### iterateKeysChunk
Reference: `1`

```
```
