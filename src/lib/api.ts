// all api calls should be written up as methods here (where the methods take the correct arguments)


import {Either} from 'tsmonad';


interface UserV1Object {
    fname: string;
    mnames: string;
    sname: string;
    detailsValid: boolean;
    validationReason: string;
    addr_street: string;
    addr_suburb: string;
    addr_postcode: string | number;
    addr_street_no: string;
}



interface CheckEmailResp {
    doOnboarding: boolean;
}

type R<r> = Either<string, r>


const mkResp = (data) => {
    if (data.status == 200) {
        if (data.body.error === undefined) {
            return Either.right(data.body);
        } else {
            return Either.left(data.body.error);
        }
    } else {
        return Either.left(`HTTP request failed with status: ${data.status}`);
    }
};


const mkErr = path => err => {
    // console.log('Flux api got error', err);
    return Either.left(`Request error at ${path}: ${err.status}`);
}


const FluxApi = {
    install: function(Vue, options) {

        const _api2 = (_path: string) => {
            let root;
            if (Vue.$dev) {
                root = "https://dev.api.flux.party/";
            } else {
                root = "https://api.flux.party/";
            }
            return  root + _path;
        }

        const _api1 = (_path: string) => {
            if (_path.indexOf("api/v") === -1) {
                _path = "api/v0/" + _path
            }

            let root
            if (Vue.$dev) {
                root = "https://flux-api-dev.herokuapp.com/"
            } else {
                root = "https://api.voteflux.org/"
            }
            return root + _path
        }

        const post = (url, data) => {
            return Vue.http.post(url, data).then(mkResp, mkErr(url));
        }

        Vue.prototype.$flux = {
            v2: {
                checkEmailToOnboard({email}): R<CheckEmailResp> {
                    return post(_api2('user/check_email'), {email})
                }
            },

            v1: {
                getUserDetails({s}): R<UserV1Object> {
                    return post(_api1('user_details'), {s})
                },
                sendUserDetails({email}) {
                    return post(_api1('send_user_details'), {email})
                }
            },

            auth: {
                getSavedAuth() {
                    const memberSecret = localStorage.getItem('s')
                    const memberApiToken = localStorage.getItem('flux.member.apiToken')
                    return {memberApiToken, memberSecret}
                },

                saveApiToken(token: string) {
                    localStorage.setItem('flux.member.apiToken', token)
                },

                saveSecret(secret: string) {
                    localStorage.setItem('s', secret)
                }
            }
        }
    }
}


export default FluxApi;
