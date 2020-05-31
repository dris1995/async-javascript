import setText, {appendText, showWaiting, hideWaiting} from "./results.mjs";

export function get() {
    // payload from the axios request will placed in property named data
    axios.get("http://localhost:3000/orders/1")
    .then(({ data }) => {
        setText(JSON.stringify(data));
    });
}

export function getCatch() {

    axios.get("http://localhost:3000/orders/123")
    .then(({ data }) => {
        setText(JSON.stringify(data));
    })
    .catch(err => {
        setText(err);
    });
}

export function chain() {
    // when chaining promises remember to return the promise in each then
    axios.get("http://localhost:3000/orders/1")
    .then(({ data }) => {
        return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
    })
    .then(({ data }) => {
        setText(`City: ${data.city}`);
    });
}

export function chainCatch() {

    // the first catch will only catch error from the first then
    // the second catch will catch all error in chain of then
    // most of the time you only want one catch, if you do handle error for each thn
    // make sure to handle it thoroughly
    axios.get("http://localhost:3000/orders/1")
    .then(({ data }) => {
        axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
        throw new Error("Error!");
    })
    .catch(err => {
        setText(err);
        return { data:{}};
    })
    .then(({ data }) => {
        setText(`City: ${data.m.city}`);
        throw new Error("Second Error!");
    })
    .catch(err => {
        setText(err);
    });
}

export function final() {
    showWaiting();
    axios.get("http://localhost:3000/orders/1")
    .then(({ data }) => {
        return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
    })
    .then(({ data }) => {
        setText(`City: ${data.city}`);
    })
    .catch(err => {
        setText(err);
    })
    .finally(() => {
        // this code will run after all asyn code finishes
        setTimeout(() => {
            hideWaiting();
        }, 1500);

        appendText("-- Completelt Done");
    });
}