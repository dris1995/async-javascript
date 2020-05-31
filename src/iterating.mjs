import setText , {appendText} from './results.mjs';

/* Asynchronous key words
    1. async
    2. await
    Return value is wrapped in a promise
    await pauses the exection of a Asynchronous function while it waits for
    the promise to be fulfilled of rejected

    async function getName() {
        return[];
    }

    const getName = async () => {
        return [];
    }
*/

export async function get(){
    const {data} = await axios.get("http://localhost:3000/orders/1");
    setText(JSON.stringify(data));
}

export async function getCatch(){
    try {
        const {data} = await axios.get("http://localhost:3000/orders/123");
        setText(JSON.stringify(data));
    } catch(error) {
        setText(error);
    }
}

export async function chain(){
    // these calls are sequential
    const {data} = await axios.get("http://localhost:3000/orders/1");
    const {data: address} = await axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);

    setText(`City: ${JSON.stringify(address.city)}`);
}

export async function concurrent(){

    // both call kick off at the same time non-sequential
    let orderStatus = axios.get("http://localhost:3000/orderStatuses");
    let orders = axios.get("http://localhost:3000/orders");

    setText("");

    // await the two functions to fulfill
    const {data:statuses} = await orderStatus;
    const {data: order} = await orders;

    appendText(JSON.stringify(statuses));
    appendText(JSON.stringify(order[0]));

}

export async function parallel(){
    setText("");

    await Promise.all([
        (async () => { 
            const {data} = await axios.get("http://localhost:3000/orderStatuses");
            appendText(JSON.stringify(data));
        }) (),
        (async () => { 
            const {data} = await axios.get("http://localhost:3000/orders");
            appendText(JSON.stringify(data));
        }) ()
    ]);

}