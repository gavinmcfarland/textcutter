// Recursively checking if selected node is inside the instance — if it is we can't split layers, as we can't add new ones in instance
export const nodeInInstance = (item: BaseNode) => {
	if (item.parent.type == 'PAGE') {
		return false
	} else {
		if (item.parent.type == 'INSTANCE') {
			return true
		} else {
			nodeInInstance(item.parent)
		}
	}
}
