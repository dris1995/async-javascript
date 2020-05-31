import setText, { appendText } from "./results.mjs";

export function timeout(){ 
    // promises takes one and only one function for constructor (executor function)
    const wait = new Promise((resolve) => {
        // this code get executed imdenditly
        setTimeout(() => {
            // use resolve to send data
            resolve("Timeout!");
        }, 1500);
    });

    wait.then(text => setText(text));
}

export function interval(){
    let counter = 0;
    const wait = new Promise((resolve) => {
        setInterval(() => {
            console.log("INTERVAL");
            resolve(`Timeout! ${++counter}`);
        }, 1500);
    });

    wait.then(text => setText(text))
        .finally(() =>  appendText(`-- Done ${++counter}`));
}

export function clearIntervalChain(){
    let counter = 0;
    let interval;
    const wait = new Promise((resolve) => {
        interval = setInterval(() => {
            console.log("INTERVAL");
            resolve(`Timeout! ${++counter}`);
        }, 1500);
    });

    wait.then(text => setText(text))
        .finally(() =>  {
            clearInterval(interval);
        });
}

export function xhr(){

    // you have the power to control how a promise is settled
    const request = new Promise((resolve, reject) => {
       let xhr = new XMLHttpRequest();
       xhr.open("GET", "http://localhost:3000/user/7");
       xhr.onload = () => {
           if(xhr.status === 200 ) {
            resolve(xhr.responseText);
           }else {
            reject(xhr.statusText);
           }
       }
       xhr.onerror = () => reject("Request Failed");
       xhr.send();
    });

    request.then(result => setText(result))
        .catch(reason => setText(reason));

}

export function allPromises(){
    // waiting for ALL promises to resolved
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");
    let addressTypes = axios.get("http://localhost:3000/addressTypes");


    // this will queue all promises and wait for them to return
    // .all will wait until either ALL fulfill OR One rejects
    // the data will return in the order that you pass into Promise.all([<promises>])
    Promise.all([categories, statuses, userTypes, addressTypes])
        .then(([cat, stat, type, address]) => {
            setText("");

            appendText(JSON.stringify(cat.data));
            appendText(JSON.stringify(stat.data));
            appendText(JSON.stringify(type.data));
            appendText(JSON.stringify(address.data));
        })
        .catch(reason => {
            setText(reason);
        });
}

export function allSettled(){
    // Note: Not all browser support allSettled
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");
    let addressTypes = axios.get("http://localhost:3000/addressTypes");

    /* Different than all
        1. Different Data Returned
            Instead of an array it returns and object with two keys
            {
                status: "fulfilled",
                value: {}
            }

            OR

            {
                status: "rejected",
                value: {}
            }
        2. Don't Need a catch
    */
    Promise.allSettled([categories, statuses, userTypes, addressTypes])
        .then((values) => {
            let results = values.map(v => {
                if(v.status === "fulfilled") {
                    return `FULFILLED: ${JSON.stringify(v.value.data[0])} `;
                }

                return `REJECTED: ${v.reason.message} `;
            })
            
            setText(results);
        })
        .catch(reason => {
            setText(reason);
        });

}

export function race(){

    //  create two request
    let user = axios.get("http://localhost:3000/users");
    let backup = axios.get("http://localhost:3001/users");

    // Race stops when first promise settles (rare fucntion)
    Promise.race([user, backup])
        .then(users => setText(JSON.stringify(users.data)))
        .catch(reason => setText(reason));

}