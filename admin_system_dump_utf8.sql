--
-- PostgreSQL database dump
--

\restrict CQZi4Yepjgl8uLRyj4ubDl23rJahe53bbe9USWxeBab47r5VXznvvN2WRZ2AFdU

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sys_department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_department (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    code character varying(50),
    parent_id integer,
    leader_id integer,
    phone character varying(20),
    email character varying(100),
    sort integer DEFAULT 0 NOT NULL,
    status smallint DEFAULT 1 NOT NULL,
    description character varying(200),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sys_department OWNER TO postgres;

--
-- Name: sys_department_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sys_department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sys_department_id_seq OWNER TO postgres;

--
-- Name: sys_department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_department_id_seq OWNED BY public.sys_department.id;


--
-- Name: sys_dict_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_dict_data (
    id integer NOT NULL,
    dict_type_id integer NOT NULL,
    label character varying(50) NOT NULL,
    value character varying(50) NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    css_class character varying(50),
    remark character varying(200),
    status smallint DEFAULT 1 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sys_dict_data OWNER TO postgres;

--
-- Name: sys_dict_data_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sys_dict_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sys_dict_data_id_seq OWNER TO postgres;

--
-- Name: sys_dict_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_dict_data_id_seq OWNED BY public.sys_dict_data.id;


--
-- Name: sys_dict_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_dict_type (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    code character varying(50) NOT NULL,
    description character varying(200),
    sort integer DEFAULT 0 NOT NULL,
    status smallint DEFAULT 1 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sys_dict_type OWNER TO postgres;

--
-- Name: sys_dict_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sys_dict_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sys_dict_type_id_seq OWNER TO postgres;

--
-- Name: sys_dict_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_dict_type_id_seq OWNED BY public.sys_dict_type.id;


--
-- Name: sys_file; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_file (
    id integer NOT NULL,
    user_id integer NOT NULL,
    bucket_name character varying(100) NOT NULL,
    bucket_type character varying(50) NOT NULL,
    folder character varying(100) NOT NULL,
    file_name character varying(255) NOT NULL,
    original_name character varying(255) NOT NULL,
    file_size integer NOT NULL,
    mime_type character varying(100) NOT NULL,
    file_url text NOT NULL,
    status smallint DEFAULT 1 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sys_file OWNER TO postgres;

--
-- Name: sys_file_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sys_file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sys_file_id_seq OWNER TO postgres;

--
-- Name: sys_file_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_file_id_seq OWNED BY public.sys_file.id;


--
-- Name: sys_menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_menu (
    id integer NOT NULL,
    parent_id integer,
    name character varying(50) NOT NULL,
    title character varying(50) NOT NULL,
    type character varying(20) NOT NULL,
    path character varying(200),
    component character varying(200),
    permission character varying(100),
    icon character varying(50),
    sort integer DEFAULT 0 NOT NULL,
    visible smallint DEFAULT 1 NOT NULL,
    status smallint DEFAULT 1 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sys_menu OWNER TO postgres;

--
-- Name: sys_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sys_menu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sys_menu_id_seq OWNER TO postgres;

--
-- Name: sys_menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_menu_id_seq OWNED BY public.sys_menu.id;


--
-- Name: sys_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_permission (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    code character varying(100) NOT NULL,
    path character varying(200),
    method character varying(10),
    description character varying(200),
    status smallint DEFAULT 1 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sys_permission OWNER TO postgres;

--
-- Name: sys_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sys_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sys_permission_id_seq OWNER TO postgres;

--
-- Name: sys_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_permission_id_seq OWNED BY public.sys_permission.id;


--
-- Name: sys_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_role (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    code character varying(50) NOT NULL,
    description character varying(200),
    data_scope integer DEFAULT 1 NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    status smallint DEFAULT 1 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sys_role OWNER TO postgres;

--
-- Name: sys_role_department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_role_department (
    role_id integer NOT NULL,
    department_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sys_role_department OWNER TO postgres;

--
-- Name: sys_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sys_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sys_role_id_seq OWNER TO postgres;

--
-- Name: sys_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_role_id_seq OWNED BY public.sys_role.id;


--
-- Name: sys_role_menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_role_menu (
    role_id integer NOT NULL,
    menu_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sys_role_menu OWNER TO postgres;

--
-- Name: sys_role_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_role_permission (
    role_id integer NOT NULL,
    permission_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sys_role_permission OWNER TO postgres;

--
-- Name: sys_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_user (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    nickname character varying(50),
    email character varying(100),
    phone character varying(20),
    avatar character varying(255),
    avatar_id integer,
    avatar_name character varying(255),
    department_id integer,
    status smallint DEFAULT 1 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sys_user OWNER TO postgres;

--
-- Name: sys_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sys_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sys_user_id_seq OWNER TO postgres;

--
-- Name: sys_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_user_id_seq OWNED BY public.sys_user.id;


--
-- Name: sys_user_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_user_role (
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sys_user_role OWNER TO postgres;

--
-- Name: sys_department id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_department ALTER COLUMN id SET DEFAULT nextval('public.sys_department_id_seq'::regclass);


--
-- Name: sys_dict_data id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_dict_data ALTER COLUMN id SET DEFAULT nextval('public.sys_dict_data_id_seq'::regclass);


--
-- Name: sys_dict_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_dict_type ALTER COLUMN id SET DEFAULT nextval('public.sys_dict_type_id_seq'::regclass);


--
-- Name: sys_file id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_file ALTER COLUMN id SET DEFAULT nextval('public.sys_file_id_seq'::regclass);


--
-- Name: sys_menu id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_menu ALTER COLUMN id SET DEFAULT nextval('public.sys_menu_id_seq'::regclass);


--
-- Name: sys_permission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_permission ALTER COLUMN id SET DEFAULT nextval('public.sys_permission_id_seq'::regclass);


--
-- Name: sys_role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_role ALTER COLUMN id SET DEFAULT nextval('public.sys_role_id_seq'::regclass);


--
-- Name: sys_user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_user ALTER COLUMN id SET DEFAULT nextval('public.sys_user_id_seq'::regclass);


--
-- Data for Name: sys_department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_department (id, name, code, parent_id, leader_id, phone, email, sort, status, description, created_at, updated_at) FROM stdin;
1	省养护处	root	\N	1	027-00000000	root@example.com	0	1	省养护处	2026-03-22 06:15:20.224	2026-03-23 07:16:26.158
5	襄城区	420602000000	3	5	15736542019	123@qq.com	1	1	襄阳市-樊城区	2026-03-23 07:22:26.919	2026-03-23 07:23:43.336
6	南漳县	420624000000	3	\N	15678921345	12345@qq.com	2	1	襄阳市-南漳县	2026-03-23 07:24:59.677	2026-03-23 07:24:59.677
7	欧庙镇	omz	5	\N	\N	\N	1	1	襄阳-襄城-欧庙	2026-03-23 07:29:06.374	2026-03-23 07:29:06.374
3	襄阳市	420000000000	1	3	027-66666666	rd@example.com	1	1	襄阳市	2026-03-22 06:18:47.579	2026-03-23 07:33:37.872
4	武汉市	420100000000	1	4	027-66666666	rd@example.com	2	1	武汉市养护中心	2026-03-22 06:21:49.911	2026-03-23 07:33:45.199
\.


--
-- Data for Name: sys_dict_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_dict_data (id, dict_type_id, label, value, sort, css_class, remark, status, created_at, updated_at) FROM stdin;
1	1	男	1	1	primary	男性用户	1	2026-03-23 01:10:03.57	2026-03-23 01:10:03.57
2	1	女	2	2	primary	女性用户	1	2026-03-23 01:10:50.447	2026-03-23 01:10:50.447
\.


--
-- Data for Name: sys_dict_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_dict_type (id, name, code, description, sort, status, created_at, updated_at) FROM stdin;
1	用户性别	user_gender	用户性别字典	1	1	2026-03-23 01:07:17.417	2026-03-23 01:07:17.417
\.


--
-- Data for Name: sys_file; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_file (id, user_id, bucket_name, bucket_type, folder, file_name, original_name, file_size, mime_type, file_url, status, created_at, updated_at) FROM stdin;
1	1	user-avatars	userAvatar	images	images/1774244664919-最新福的季节.png	最新福的季节.png	613116	image/png	http://localhost:19000/user-avatars/images/1774244664919-%E6%9C%80%E6%96%B0%E7%A6%8F%E7%9A%84%E5%AD%A3%E8%8A%82.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20260323%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260323T054425Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=203c2dcef37ca0f04148d84dc9152d25a587895c3440c66d4854aac777b4333d	1	2026-03-23 05:44:25.036	2026-03-23 05:44:25.036
2	1	user-avatars	userAvatar	images	images/1774259017886-技术配置.png	技术配置.png	115703	image/png	http://localhost:19000/user-avatars/images/1774259017886-%E6%8A%80%E6%9C%AF%E9%85%8D%E7%BD%AE.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin%2F20260323%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260323T094338Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=41858a26893481b7131f5212fd769ca0da34abfda3c40ee898fceec70185f8c2	1	2026-03-23 09:43:38.025	2026-03-23 09:43:38.025
\.


--
-- Data for Name: sys_menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_menu (id, parent_id, name, title, type, path, component, permission, icon, sort, visible, status, created_at, updated_at) FROM stdin;
3	\N	Dashboard	首页	menu	/dashboard	views/Dashboard		HomeFilled	1	1	1	2026-03-23 03:14:18.379	2026-03-23 03:16:28.306
4	\N	System	系统管理	menu	/system			Setting	10	1	1	2026-03-23 03:14:18.386	2026-03-23 03:17:24.35
5	4	SystemUser	用户管理	menu	/system/user	views/system/User		User	11	1	1	2026-03-23 03:14:18.39	2026-03-23 03:17:43.074
6	4	SystemRole	角色管理	menu	/system/role	views/system/Role		Avatar	12	1	1	2026-03-23 03:14:18.395	2026-03-23 03:17:57.624
7	4	SystemMenu	菜单管理	menu	/system/menu	views/system/Menu		Menu	13	1	1	2026-03-23 03:14:18.399	2026-03-23 03:18:08.821
8	4	SystemDict	数据字典	menu	/system/dict	views/system/Dict		Document	14	1	1	2026-03-23 03:14:18.403	2026-03-23 03:18:21.106
9	4	SystemDepartment	部门管理	menu	/system/department	views/system/Department		OfficeBuilding	11	1	1	2026-03-23 03:35:09.214	2026-03-23 03:44:51.963
10	\N	AssetManagement	资源管理	menu	/asset			Menu	3	1	1	2026-03-23 05:50:30.935	2026-03-23 05:50:30.935
11	10	AssetBridge	桥梁管理	menu	/asset/bridge	views/assetManagement/Bridge			1	1	1	2026-03-23 05:51:38.709	2026-03-23 05:51:38.709
12	10	AssetTunnel	隧道管理	menu	/asset/tunnel	views/assetManagement/Tunnel			2	1	1	2026-03-23 05:52:24.554	2026-03-23 05:52:24.554
13	10	AssetFacility	附属设施	menu	/asset/facility	views/assetManagement/Facility			3	1	1	2026-03-23 05:53:05.285	2026-03-23 05:53:05.285
14	10	AssetStation	养护站管理	menu	/asset/station	views/assetManagement/Station			4	1	1	2026-03-23 05:53:45.432	2026-03-23 05:53:45.432
15	11	asset:bridge:create	新增	button	\N	\N	asset:bridge:create	\N	1	1	1	2026-03-23 06:18:38.47	2026-03-23 06:18:38.47
16	11	asset:bridge:update	编辑	button	\N	\N	asset:bridge:update	\N	2	1	1	2026-03-23 06:19:29.557	2026-03-23 06:19:29.557
17	11	asset:bridge:delete	删除	button	\N	\N	asset:bridge:delete	\N	3	1	1	2026-03-23 06:19:57.111	2026-03-23 06:19:57.111
\.


--
-- Data for Name: sys_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_permission (id, name, code, path, method, description, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sys_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_role (id, name, code, description, data_scope, sort, status, created_at, updated_at) FROM stdin;
4	省	pyhzx	省	2	1	1	2026-03-23 07:11:29.92	2026-03-23 07:30:00.92
5	市	syhzx	市	2	2	1	2026-03-23 07:11:56.806	2026-03-23 07:30:08.185
6	县区	xyhzx	县区	2	3	1	2026-03-23 07:12:31.865	2026-03-23 07:30:29.307
7	站	yhz	站	2	4	1	2026-03-23 07:12:56.542	2026-03-23 07:30:40.009
1	省管理员	admin	省管理员角色	1	0	1	2026-03-23 01:05:13.907	2026-03-23 07:31:17.942
8	人员	yhy	人员	4	5	1	2026-03-23 07:13:28.797	2026-03-23 07:32:16.818
\.


--
-- Data for Name: sys_role_department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_role_department (role_id, department_id, created_at) FROM stdin;
\.


--
-- Data for Name: sys_role_menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_role_menu (role_id, menu_id, created_at) FROM stdin;
1	3	2026-03-23 06:29:33.646
1	10	2026-03-23 06:29:33.646
1	11	2026-03-23 06:29:33.646
1	15	2026-03-23 06:29:33.646
1	16	2026-03-23 06:29:33.646
1	17	2026-03-23 06:29:33.646
1	12	2026-03-23 06:29:33.646
1	13	2026-03-23 06:29:33.646
1	14	2026-03-23 06:29:33.646
1	4	2026-03-23 06:29:33.646
1	9	2026-03-23 06:29:33.646
1	5	2026-03-23 06:29:33.646
1	6	2026-03-23 06:29:33.646
1	7	2026-03-23 06:29:33.646
1	8	2026-03-23 06:29:33.646
4	3	2026-03-23 07:14:12.672
4	10	2026-03-23 07:14:12.672
4	11	2026-03-23 07:14:12.672
4	12	2026-03-23 07:14:12.672
4	13	2026-03-23 07:14:12.672
4	14	2026-03-23 07:14:12.672
5	3	2026-03-23 07:14:30.536
5	10	2026-03-23 07:14:30.536
5	11	2026-03-23 07:14:30.536
5	12	2026-03-23 07:14:30.536
5	13	2026-03-23 07:14:30.536
5	14	2026-03-23 07:14:30.536
6	3	2026-03-23 07:14:56.435
6	10	2026-03-23 07:14:56.435
6	11	2026-03-23 07:14:56.435
6	12	2026-03-23 07:14:56.435
6	13	2026-03-23 07:14:56.435
6	14	2026-03-23 07:14:56.435
7	3	2026-03-23 07:15:04.302
7	10	2026-03-23 07:15:04.302
7	11	2026-03-23 07:15:04.302
7	12	2026-03-23 07:15:04.302
7	13	2026-03-23 07:15:04.302
7	14	2026-03-23 07:15:04.302
8	3	2026-03-23 07:15:16.396
8	10	2026-03-23 07:15:16.396
8	11	2026-03-23 07:15:16.396
8	12	2026-03-23 07:15:16.396
8	13	2026-03-23 07:15:16.396
8	14	2026-03-23 07:15:16.396
\.


--
-- Data for Name: sys_role_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_role_permission (role_id, permission_id, created_at) FROM stdin;
\.


--
-- Data for Name: sys_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_user (id, username, password, nickname, email, phone, avatar, avatar_id, avatar_name, department_id, status, created_at, updated_at) FROM stdin;
1	admin	$2b$10$pV5MJi6BWBqMabe9B57EkOyJ7LdxbLc25ddsMvyg7F30de8uwH.gC	管理员	admin@example.com	\N	\N	\N	\N	1	1	2026-03-22 05:41:56.958	2026-03-23 06:35:44.656
3	zhangsan	$2b$10$n6ye91/92pAuQRp1LJWJxOeo7aFyIyppMe5MB2KJB/wbg1SPk.V5W	\N	row287630@gmail.com	\N	\N	\N	\N	3	1	2026-03-23 07:03:19.909	2026-03-23 07:03:19.909
4	lisi	$2b$10$Tho7mNbhfY4XABfD.d7rEewTrqp6o8uZV0a6HwGZH.p.QYdf7NCoy	\N	123@qq.com	\N	\N	\N	\N	4	1	2026-03-23 07:03:58.828	2026-03-23 07:03:58.828
5	wangwu	$2b$10$1bJ5G2Y/90UrDTk4I1wfuODTCH8xAbKHVxtYjVNfPlxLOTmLSKdiS	\N	1234@qq.com	\N	\N	\N	\N	5	1	2026-03-23 07:23:19.518	2026-03-23 07:23:19.518
6	zhaoliu	$2b$10$kRMnNtHGDZRpN64ZDHdA6OGptZlTfZ7TTDF0KsqadEg20OVybD70i	\N	12345@qq.com	\N	\N	\N	\N	6	1	2026-03-23 07:25:36.871	2026-03-23 07:25:36.871
\.


--
-- Data for Name: sys_user_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_user_role (user_id, role_id, created_at) FROM stdin;
1	1	2026-03-23 03:14:18.405
6	6	2026-03-23 07:25:56.106
5	6	2026-03-23 07:26:05.604
4	5	2026-03-23 07:26:12.056
3	5	2026-03-23 07:26:20.091
\.


--
-- Name: sys_department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_department_id_seq', 7, true);


--
-- Name: sys_dict_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_dict_data_id_seq', 2, true);


--
-- Name: sys_dict_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_dict_type_id_seq', 1, true);


--
-- Name: sys_file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_file_id_seq', 2, true);


--
-- Name: sys_menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_menu_id_seq', 17, true);


--
-- Name: sys_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_permission_id_seq', 1, false);


--
-- Name: sys_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_role_id_seq', 8, true);


--
-- Name: sys_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_user_id_seq', 6, true);


--
-- Name: sys_department sys_department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_department
    ADD CONSTRAINT sys_department_pkey PRIMARY KEY (id);


--
-- Name: sys_dict_data sys_dict_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_dict_data
    ADD CONSTRAINT sys_dict_data_pkey PRIMARY KEY (id);


--
-- Name: sys_dict_type sys_dict_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_dict_type
    ADD CONSTRAINT sys_dict_type_pkey PRIMARY KEY (id);


--
-- Name: sys_file sys_file_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_file
    ADD CONSTRAINT sys_file_pkey PRIMARY KEY (id);


--
-- Name: sys_menu sys_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_menu
    ADD CONSTRAINT sys_menu_pkey PRIMARY KEY (id);


--
-- Name: sys_permission sys_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_permission
    ADD CONSTRAINT sys_permission_pkey PRIMARY KEY (id);


--
-- Name: sys_role_department sys_role_department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_role_department
    ADD CONSTRAINT sys_role_department_pkey PRIMARY KEY (role_id, department_id);


--
-- Name: sys_role_menu sys_role_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_role_menu
    ADD CONSTRAINT sys_role_menu_pkey PRIMARY KEY (role_id, menu_id);


--
-- Name: sys_role_permission sys_role_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_role_permission
    ADD CONSTRAINT sys_role_permission_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: sys_role sys_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_role
    ADD CONSTRAINT sys_role_pkey PRIMARY KEY (id);


--
-- Name: sys_user sys_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_user
    ADD CONSTRAINT sys_user_pkey PRIMARY KEY (id);


--
-- Name: sys_user_role sys_user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_user_role
    ADD CONSTRAINT sys_user_role_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: sys_department_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sys_department_code_key ON public.sys_department USING btree (code);


--
-- Name: sys_dict_type_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sys_dict_type_code_key ON public.sys_dict_type USING btree (code);


--
-- Name: sys_permission_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sys_permission_code_key ON public.sys_permission USING btree (code);


--
-- Name: sys_role_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sys_role_code_key ON public.sys_role USING btree (code);


--
-- Name: sys_role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sys_role_name_key ON public.sys_role USING btree (name);


--
-- Name: sys_user_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sys_user_email_key ON public.sys_user USING btree (email);


--
-- Name: sys_user_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sys_user_username_key ON public.sys_user USING btree (username);


--
-- Name: sys_dict_data sys_dict_data_dict_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_dict_data
    ADD CONSTRAINT sys_dict_data_dict_type_id_fkey FOREIGN KEY (dict_type_id) REFERENCES public.sys_dict_type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sys_role_department sys_role_department_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_role_department
    ADD CONSTRAINT sys_role_department_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.sys_department(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sys_role_department sys_role_department_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_role_department
    ADD CONSTRAINT sys_role_department_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.sys_role(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sys_role_menu sys_role_menu_menu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_role_menu
    ADD CONSTRAINT sys_role_menu_menu_id_fkey FOREIGN KEY (menu_id) REFERENCES public.sys_menu(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sys_role_menu sys_role_menu_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_role_menu
    ADD CONSTRAINT sys_role_menu_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.sys_role(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sys_role_permission sys_role_permission_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_role_permission
    ADD CONSTRAINT sys_role_permission_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.sys_permission(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sys_role_permission sys_role_permission_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_role_permission
    ADD CONSTRAINT sys_role_permission_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.sys_role(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sys_user sys_user_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_user
    ADD CONSTRAINT sys_user_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.sys_department(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sys_user_role sys_user_role_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_user_role
    ADD CONSTRAINT sys_user_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.sys_role(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sys_user_role sys_user_role_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_user_role
    ADD CONSTRAINT sys_user_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.sys_user(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict CQZi4Yepjgl8uLRyj4ubDl23rJahe53bbe9USWxeBab47r5VXznvvN2WRZ2AFdU

