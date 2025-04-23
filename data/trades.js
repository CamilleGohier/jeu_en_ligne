export const trades = {
    "farmer" : [
        {
            "need" : [{ item: 'wood', quantity: 1, french: 'bûche' }],
            "create" : { item: 'stick', quantity: 4, french: 'bâton' }
        }, 
        {
            "need" : [{ item: 'wood', quantity: 3, french: 'bûche' }],
            "create" : { item: 'plank', quantity: 1, french: 'planche' }
        },
        {
            "need" : [{ item: 'tomato', quantity: 1, french: 'tomate' }],
            "create" : { item: 'tomato_seed', quantity: 1, french: 'graine de tomate' }
        },
        {
            "need" : [{ item: 'wheat', quantity: 2, french: 'blé' }],
            "create" : { item: 'wheat_seed', quantity: 1, french: 'graine de blé' }
        }
    ],
    "blacksmith" : [
        {
            "need" : [{ item: 'plank', quantity: 1, french: 'planche'}, { item: 'stick', quantity: 4, french: 'bâton'}],
            "create" : { item: 'wall', quantity: 4, french: 'mur' }
        },
        {
            "need" : [{ item: 'wood', quantity: 1, french: 'bûche' }, { item: 'stick', quantity: 2, french: 'bâton' }],
            "create" : { item: 'fence', quantity: 4, french: 'barrière' }
        },
        {
            "need" : [{ item: 'stick', quantity: 2, french: 'bâton' }],
            "create" : { item: 'parquet', quantity: 1, french: 'sol en bois' }
        },
        {
            "need" : [{ item: 'wood', quantity: 4, french: 'bûche' }, { item: 'ore', quantity: 2, french: 'minerai' }],
            "create" : { item: 'door', quantity: 1, french: 'porte' }
        },
        {
            "need" : [{ item: 'plank', quantity: 1, french: 'planche' }, { item: 'slime_bubble', quantity: 4, french: 'bulle de slime' }, { item: 'stone', quantity: 2, french: 'caillou' }],
            "create" : { item: 'workbench', quantity: 1, french: 'atelier' }
        },
        {
            "need" : [{ item: 'plank', quantity: 1, french: 'planche' }, { item: 'stick', quantity: 2, french: 'bâton' }, { item: 'ore', quantity: 1, french: 'minerai' }],
            "create" : { item: 'shelf', quantity: 1, french: 'coffre' }
        },
        {
            "need" : [{ item: 'plank', quantity: 2, french: 'planche' }, { item: 'stone', quantity: 3, french: 'caillou' }],
            "create" : { item: 'feeder', quantity: 1, french: 'mangeoire' }
        },
        {
            "need" : [{ item: 'stick', quantity: 2, french: 'bâton' }, { item: 'wheat', quantity: 5, french: 'blé' }],
            "create" : { item: 'nest', quantity: 1, french: 'nid' }
        }
    ],
    "girl" : [
        {
            "need" : [{ item: 'wheat_seed', quantity: 1, french: 'graine de blé'}, { item: 'tomato_seed', quantity: 1, french: 'graine de tomate'}, { item: 'clay', quantity: 1, french: 'argile'}],
            "create" : { item: 'flower_pot', quantity: 1, french: 'pot de fleur' }
        },
    ]
}