SELECT "nodeId", "nodeName", "projectId", "nodeType"
	FROM public.nodes
where "nodeName" like '%SVR%'
--sver-prod-erp
	"cmpzh508y0037e4qn3gtzqnd7"


select b."nodeName" as level_1_names,a.*
	FROM public.edges a
	join public.nodes b
	on a."fromNodeId"=b."nodeId"
	
	where "toNodeId"='cmqf5ukbc00382wqn2cp9q2ks';