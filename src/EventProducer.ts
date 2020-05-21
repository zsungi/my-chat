export class EventProducer<M>
{
    private listeners: { type: keyof M, listener, obj?: Object }[] = [];
    addEventListener<K extends keyof M>( type: K, listener: M[ K ], obj?: Object )
    {
        this.listeners.push({ type, listener, obj });
    }
    removeEventListener<K extends keyof M>(type: K, listener: M[K])
    {
        this.listeners.splice(this.listeners.findIndex(x => x.type === type && x.listener === listener), 1);
    }
    protected dispatch(type: string, ...args)
    {
        for (let listener of this.listeners.filter(x => x.type === type)) listener.listener.call(listener.obj, ...args);
    }
    removeAllEventListener( obj?: Object )
    {
        if ( !obj )
            throw new Error( "Must specify object" );
        this.listeners = this.listeners.filter( x => x.obj !== obj );
    }
}

