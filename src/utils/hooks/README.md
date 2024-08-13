# How to use local storage

To use localstorage inside the whole app we need to use useLocalstorage hook exported in class locaslstorage.ts it takes a key as input with which the data will be set,get and removed from localstorage.
This class has three functions inside it :
SetItem : this function is used to set the data to localstorage with the value provided in the useLocalstorage hook it will set the value with the key that is provided in that hook.
GetItem: this function is used to get the data from localstorage with the value that is provided in the useLocalstorage hook that value will act as the key here.
RemoveItem: this function is used to delete the data from localstorage with the value that is provided in the useLocalstorage hook that value will act as the key here.
