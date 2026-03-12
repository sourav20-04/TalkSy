class ApiError extends Error {
    constructor (statusCode,message,error=[] ) {

            super(message)
            this.statusCode=statusCode,
            this.data=null,
            this.success=false,
            this.error=error
         
    }
}

export {ApiError}