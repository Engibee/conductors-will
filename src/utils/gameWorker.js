   // New file: gameWorker.js
   self.onmessage = function(e) {
     const { type, data } = e.data;
     
     if (type === 'calculateDemand') {
       // Perform complex calculations here
       const result = complexCalculation(data);
       self.postMessage({ type: 'demandResult', result });
     }
   };
   
   function complexCalculation(data) {
     // Your complex logic here
     return result;
   }