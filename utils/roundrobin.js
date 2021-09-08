/**
 * Roundrobin
 */

module.exports = {
    roundRobin: function(array) {
        if (array.length % 2 === 1) {
            array.push(null);
        }

        const arrCount = array.length;
        const rounds = arrCount - 1;
        const half = arrCount / 2;

        let finalArrangement = [];

        const arrayIndexes = array.map((_, i) => i).slice(1);

        for (let round = 0; round < rounds; round++) {
            const arrayPairing = [];

            const newIndexes = [0].concat(arrayIndexes);

            const firstHalf = newIndexes.slice(0, half);
            const secondHalf = newIndexes.slice(half, arrCount).reverse();

            for (let i = 0; i < firstHalf.length; i++) {
                arrayPairing.push(
                    firstHalf[i]
                );
                arrayPairing.push(
                    secondHalf[i],
                );
            }

            // rotating the array
            arrayIndexes.push(arrayIndexes.shift());
            finalArrangement = [...finalArrangement, ...arrayPairing];
        }

        return finalArrangement;
    }
}
