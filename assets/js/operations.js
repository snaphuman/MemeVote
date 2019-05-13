var operations = {
    async onCallDataAndFunctionAsync(client, func, args, options, types) {
            const extraOpts = {
                //'owner': settings.account.pub
            };

            const opts = Object.assign(extraOpts, options);
        console.log('options: ', opts);
            if (func && args && types) {
                try {
                    const dataRes = await this.contractAECall(client, func, args, opts);
                    if (types !== '()') {
                        const data = await client.contractDecodeData(types, dataRes.result.returnValue);
                        console.log(data);
                        return data;
                    }
                } catch (err) {
                    console.log(err);
                }
            } else {
                console.log('Please enter a Function and 1 or more Arguments.');
            }
        },
    contractAECall(client, func, args, options) {

            console.log(`calling a function on a deployed contract with func: ${func}, args: ${args} and options:`, options);
            return client.contractCall(settings.contractAddress,
                                            'sophia-address',
                                            settings.contractAddress,
                                            func,
                                            { args, options });

        }
};
