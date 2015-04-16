var data = [
    {
        text: 'Parent 1',
        nodes: [
            {
                text: 'Child 1',
                nodes: [
                    {
                        text: 'Grandchild 1'
                    },
                    {
                        text: 'Grandchild 2'
                    }
                ]
            },
            {
                text: 'Child 2'
            }
        ]
    },
    {
        text: 'Parent 2'
    },
    {
        text: 'Parent 3'
    },
    {
        text: 'Parent 4'
    },
    {
        text: 'Parent 5'
    }
];

var test = function () {
    console.log('click');
}

React.render(
    <TreeView
        data={data}
        color={"#428bca"}
        onLineClicked={test}/>,
    document.getElementById('treeview')
);